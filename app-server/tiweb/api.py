from flask import Flask, render_template, request, jsonify, flash, make_response, session
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from py2neo import Graph, Node
import requests
import json
import os
import pandas as pd

from flask_jwt_extended import JWTManager

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import jwt
import datetime

from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,get_jwt_identity, verify_jwt_in_request)
from flask_mail import Message, Mail
import sys
from json import dumps
from flask_bcrypt import Bcrypt
from flask_jwt import current_identity
from flask_cors import CORS
from werkzeug.datastructures import Headers
import uuid
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from tiweb import app, YAMLConfig
from gip import geoip, ASN, geoip_insert, asn_insert
from wipe_db import wipeDB
from runner import full_load, insertNode, insertHostname
from whoisXML import whois, insertWhois
from exportDB import export, processExport
from cybex import insertCybex
from enrichments import insert_domain_and_user, insert_domain, insert_netblock, resolveHost, getNameservers

from connect import connectDev, connectProd
from containerlib import client
from users import db, User, RegistrationForm, LoginForm
from shodanSearch import shodan_lookup, insert_ports
from pdns import pdns_handler, insert_pdns

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# If in development, connect to local container right away
if app.config['ENV'] == 'development':
    graph = connectDev()

#db.create_all()
    
@app.route('/users/register', methods = ['POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method = 'sha256')
        new_user = User(public_id=str(uuid.uuid4()),first_name = form.first_name.data, last_name = form.last_name.data, email = form.email.data, username = form.username.data, password = hashed_password, admin = form.admin.data)
        db.session.add(new_user)
        db.session.commit()
        result = {
		'first_name' : form.first_name.data,
		'last_name' : form.last_name.data,
		'email' : form.email.data,
		'password' : form.password.data	
	    }

        c = client(app.config['CONTAINER_BEARER'], app.config['CONTAINER_URLBASE'], app.config['CONTAINER_PROJECTID'], app.config['CONTAINER_CLUSTERID'], None, app.config['CONTAINER_CLUSTERIP'])
        r = c.add_database()

        if(r and r["status"]):
            print("Created Database: " + r["data"]["id"])
        else:
            print("Error: " + r["error"])

        r = c.get_database_info()
        #print(r)
        #sys.stdout.flush()

        if(r and r["status"]):
           #print(json.dumps(r['data']))
           user = User.query.filter_by(username=form.username.data).first()
           user.db_ip = r['data']['ip']
           user.db_port = r['data']['port']
           db.session.commit() 
           
        return jsonify({'result' : result})
        
    else:
        result = jsonify({"error":"enter all the values"})
        return result

    

@app.route('/users/login', methods =['POST'])
def login():
    form = LoginForm()
    result = ''
    
    if form.validate_on_submit():
        user= User.query.filter_by(username = form.username.data).first()                                
        if user:
            if check_password_hash(user.password, form.password.data):
                access_token = create_access_token(identity = {'username': form.username.data})
                result = access_token
                # if(user.db_ip is None or user.db_port is None):
                #     c = client(app.config['CONTAINER_BEARER'], app.config['CONTAINER_URLBASE'], app.config['CONTAINER_PROJECTID'], app.config['CONTAINER_CLUSTERID'], None, app.config['CONTAINER_CLUSTERIP'])
                #     r = c.add_database()
                #     if(r and r["status"]):
                #         print("Created Database: " + r["data"]["id"])
                #     else:
                #         print("Error: " + r["error"])
                #         r = c.get_database_info()
                #         if(r and r["status"]):
                #             user = User.query.filter_by(username=form.username.data).first()
                #             user.db_ip = r['data']['ip']
                #             user.db_port = r['data']['port']
                #             db.session.commit() 
                #     return result
                            
                # else:
                access_token = create_access_token(identity = {'username': form.username.data})
                result = access_token
                global graph
                graph = connectProd(user.db_username, user.db_password, user.db_ip, user.db_port)
                return result
                
            else:
                result = jsonify({"Error":"Invalid username and password"})
                return result

        else:
            result = jsonify({"Error":"Invalid username and password"})
            return result
    else:
        return jsonify({"Error" : "Invalid form", "Data" : form.validate_on_submit()})
	
@app.route('/remove', methods = ['POST'])
def delete():
    #form = DeleteForm()
    #if form.validate_on_submit():
    User.query.filter_by(username = request.get_json()['username']).delete()
    db.session.commit()
    result = jsonify({"message": "User deleted"})
    return result 

@app.route('/update', methods = ['POST'])
def update():
        #options = session.query(User)
        update_this = User.query.filter_by(username = request.get_json()['username']).first()
        update_this.first_name = request.get_json()['first_name']
        update_this.last_name = request.get_json()['last_name']
        update_this.email = request.get_json()['email']
        db.session.commit()
        result = jsonify({'message': 'DB updated'})
        return result 

@app.route('/find', methods = ['POST'])
def found():
    found_user= User.query.filter_by(username = request.get_json()['username']).first_or_404()
    found_f = found_user.first_name
    found_l = found_user.last_name
    #found_id = found_user.id
    db.session.commit()
    
    return str(found_f+ " "+ found_l)



@app.route('/secure')
@login_required
def home():
    return app.send_static_file('secure.html')


@app.route('/api')
def api():
    return jsonify(app.config['TEST'])


@app.route('/api/v1/neo4j/export')
def exportNeoDB():
    return jsonify(processExport(export(graph)))


# @app.route('/neo4j/load')
# def load_function():
#     full_load()
#     return "Neo4j DB loaded!"


@app.route('/api/v1/neo4j/wipe')
def wipe_function():
    wipeDB(graph)
    return jsonify({"Status":"Neo4j DB full wipe complete!"})

@app.route('/api/v1/neo4j/insertURL', methods = ['POST'])
def insert2():
    req = request.get_json()
    Ntype = req['Ntype']
    data = req['value']

    status = insertNode(Ntype, data, graph)
    if status == 1:
        return jsonify({"Status" : "Success"})
    else:
        return jsonify({"Status" : "Failed"})


@app.route('/api/v1/neo4j/insert/<Ntype>/<data>')
def insert(Ntype, data):
    status = insertNode(Ntype, data, graph)
    if status == 1:
        return jsonify({"Status" : "Success"})
    else:
        return jsonify({"Status" : "Failed"})


@app.route('/api/v1/enrich/<enrich_type>/<value>')
def enrich(enrich_type, value):
    if(enrich_type == "asn"):
            a_results = ASN(value)
            status = asn_insert(a_results, graph)
            return jsonify({"insert status" : status})

    elif enrich_type == "gip":
            g_results = geoip(value)
            status = geoip_insert(g_results, graph)
            return jsonify({"insert status" : status})

    elif enrich_type == "hostname":
            status = insertHostname(value, graph)
            return jsonify({"insert status" : status})
    
    elif enrich_type == "whois":
            w_results = whois(value)
            status = insertWhois(w_results, graph, value)
            return jsonify({"insert status" : status})

    elif enrich_type == "cybex":
            url = "http://cybexp1.acs.unr.edu:5000/api/v1.0/related/"
            headers = {'content-type': 'application/json', 'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTQyNTI2ODcsIm5iZiI6MTU1NDI1MjY4NywianRpIjoiODU5MDFhMGUtNDRjNC00NzEyLWJjNDYtY2FhMzg0OTU0MmVhIiwiaWRlbnRpdHkiOiJpbmZvc2VjIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.-Vb_TgjBkAKBcX_K3Ivq3H2N-sVkpIudJOi2a8mIwtI'}
            data = { 'ipv4-addr' : value }
            data = json.dumps(data)

            r = requests.post(url, headers=headers, data=data)
            res = json.loads(r.text)
            try:
                numOccur = len(res['objects'])
                status = insertCybex(numOccur, graph, value)
                return jsonify({"insert status" : status})

            except:
                return jsonify({"insert status" : 0})

    elif enrich_type == "deconstructEmail":
            status = insert_domain_and_user(value, graph)
            return jsonify({"insert status" : status})

    elif enrich_type == "netblock":
            status = insert_netblock(value, graph)
            return jsonify({"insert status" : status})
    
    elif enrich_type == "ports":
            results = shodan_lookup(value)
            status = insert_ports(results, graph, value)
            return jsonify({"insert status" : status})

    elif enrich_type == "resolveHost":
            status = resolveHost(value, graph)
            return jsonify({"insert status" : status})
    
    elif enrich_type == "nameservers":
            w_results = whois(value)
            status = getNameservers(w_results, graph, value)
            return jsonify({"insert status" : status})
    else:
        return "Invalid enrichment type. Try 'asn', 'gip', 'whois', or 'hostname'."

@app.route('/api/v1/enrichURL', methods=['POST'])
def enrichURL():
    req = request.get_json()
    value = req['value']

    status = insert_domain(value, graph)
    return jsonify({"insert status" : status})

@app.route('/api/v1/enrich/all')
def enrich_all():
    for node in graph.nodes.match("IP"):
        enrich('asn', node['data'])
        enrich('gip', node['data'])
        enrich('whois', node['data'])
        enrich('hostname', node['data'])
    return jsonify({"Status" : "Success"})

@app.route('/api/v1/enrichPDNS', methods=['POST'])
def enrich_pdns():
    req = request.get_json()
    value = req['value']

    data = pdns_handler(value)
    print(data)
    status = insert_pdns(data, graph, value)

    return jsonify({"Insert Status" : status})

# @app.route('/api/v1/enrichBlock', methods=['POST'])
# def enrichBlock():
#         req = request.get_json()
#         print(str(req))
#         value = req['value']
#         print(str(value))
#         results = shodan_lookup(value)
#         status = insert_ports(results, graph, value)
#         return jsonify({"insert status" : status})


# @app.route('/details/<id>')
# def show_details(id):
#     node = graph.nodes.get(int(id))
#     return jsonify(node)

# @app.route('/admin/ratelimit')
# def ratelimit():
#     # needs to use YAMLConfig
#     res = requests.get('https://user.whoisxmlapi.com/service/account-balance?apiKey=at_dE3c8tVnBieCdGwtzUiOFFGfuCQoz')
#     return jsonify(res.json())

@app.route('/api/v1/admin/config')
def sendConfig():
    return jsonify(YAMLConfig)

@app.route('/api/v1/event/start', methods=['POST'])
def startEvent():
    res = request.get_json()
    os.environ['eventName'] = res['eventName']
    # insert all nodes
    dType1 = res['IOCType1']
    dType2 = res['IOCType2']
    dType3 = res['IOCType3']
    status = insert(dType1, res['dataToInsert1'])
    status2 = insert(dType2, res['dataToInsert2'])
    status2 = insert(dType3, res['dataToInsert3'])
    # return status
    return status

# @app.route('/event/getName', methods=['GET'])
# def getEventName():
#     return jsonify(os.environ['eventName'])

@app.route('/api/v1/event/start/file', methods=['POST'])
def startFileEvent():
    os.environ['eventName'] = request.form['eventName']

    #load csv/json file from request.files['fileNameHere]
    fileCSVDF = pd.read_csv(request.files['file'])
    
    # parse all node types and data
    # insert all nodes
    for i in range(len(fileCSVDF)):
        Ntype = fileCSVDF.iloc[i, 0]
        Nval = fileCSVDF.iloc[i, 1]
        Ntime = fileCSVDF.iloc[i, 2]

        status = insert(Ntype, Nval)

    # return status
    return jsonify(0)

@app.route('/api/v1/session/init', methods=['POST'])
def sess_init():
    req = request.get_json()
    username = req['user']

    session['username'] = username
    # get the following from sql db (user info)
    #session['uid'] = None
    session['neoURL'] = None
    session['neoPass'] = None
    session['neoPort'] = None

    return "User {} has initialized a session.".format(session['username'])

@app.route('/', methods=['GET'])
def index_root():
    return app.send_static_file('index.html')