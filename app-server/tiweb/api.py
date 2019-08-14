from flask import abort, Flask, render_template, request, jsonify, flash, make_response, session, redirect
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required, roles_required
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
from flask_sqlalchemy import SQLAlchemy
from tiweb import app, YAMLConfig
from gip import geoip, ASN, geoip_insert, asn_insert
from wipe_db import wipeDB
from runner import full_load, insertNode, insertHostname
from whoisXML import whois, insertWhois
from exportDB import export, processExport
from cybex import insertCybex, insertRelated, replaceType
from enrichments import insert_domain_and_user, insert_domain, insert_netblock, resolveHost, getNameservers, getRegistrar, getMailServer

from connect import connectDev, connectProd
from containerlib import client
from users import  RegistrationForm, LoginForm
from shodanSearch import shodan_lookup, insert_ports
from pdns import pdns_handler, insert_pdns
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


db = SQLAlchemy(app)

engine = create_engine("mysql+mysqlconnector://cybexpadmin:cybexp19sekret@134.197.21.10:3306/cybexpui")
session1 = sessionmaker(expire_on_commit=False)
session1.configure(bind=engine)

class User(UserMixin, db.Model, Base):
    id = db.Column(db.Integer, primary_key=True) 
    public_id = db.Column(db.String(50), unique = True)                               
    first_name  = db.Column(db.String(15))
    last_name = db.Column(db.String(15))
    email = db.Column(db.String(50), unique = True)
    db_ip = db.Column(db.String(50))
    db_port = db.Column(db.Integer)
    username = db.Column(db.String(15), unique = True)
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)
    db_username=db.Column(db.String(15))
    db_password = db.Column(db.String(80))

Base.metadata.create_all(engine)


bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# login_manager.set_protection is 'basic' by default
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# If in development, connect to local container right away
if app.config['ENV'] == 'development':
    graph = connectDev()
else:
    graph= Graph()

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'cybexp123@gmail.com'
app.config['MAIL_PASSWORD'] = 'cybexpadmin'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False  
app.config['SECURITY_PASSWORD_SALT'] = 'my_precious_two'
app.config['UPLOAD_FOLDER'] = '/tiweb'



mail = Mail(app)
s=session1()

@app.route('/users/register', methods = ['POST'])   
@roles_required('admin')
def register():
    form = RegistrationForm()
    
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method = 'sha256')
        new_user = User(public_id=str(uuid.uuid4()),first_name = form.first_name.data, last_name = form.last_name.data, email = form.email.data, username = form.username.data, password = hashed_password, admin = form.admin.data)
        s.add(new_user)
        result = {
		'first_name' : form.first_name.data,
		'last_name' : form.last_name.data,
		'email' : form.email.data,
		'password' : form.password.data,
                'admin': form.admin.data
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
           
                user = s.query(User).filter(User.username == form.username.data).first() 
                user.db_ip= r['data']['ip']
                user.db_port = r['data']['port']
                us = r['data']['auth']
                print(us)
                a = us.split('/')
                user.db_username = a[0]
           
                user.db_password = a[1]
          
           
                s.commit() 
           
                msg = Message('Account Created', sender = 'cybexp123@gmail.com', recipients = [form.email.data])
                msg.body = "Hi  "+form.first_name.data + ",  Your account with CYBEX-P has been created !!"
                mail.send(msg)
                return "Sent"
        
        # DB Creation Error
        return jsonify({"Error" : "1"})
        
    else:
        # invalid form
        return jsonify({"Error" : "2"})

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
        
@app.route('/users/login', methods =['POST'])
def login():
    form = LoginForm()
    result = ''

    if form.validate_on_submit():
        user = s.query(User).filter(User.username == form.username.data).first()                                
        if user:
                if check_password_hash(user.password, form.password.data):
                        # access_token = create_access_token(identity = {'username': form.username.data}, expires_delta=False)
                        # session['token'] = access_token
                        login_user(user)
                        session['username'] = user.username
                        global graph
                        session['db_username'] = user.db_username
                        session['db_password'] = user.db_password
                        session['db_ip'] = user.db_ip
                        session['db_port'] = user.db_port
                        graph = connectProd(session['db_username'], session['db_password'], session['db_ip'], session['db_port'])
                        # print(session)
                        return "True"
                        # return session['token']
                        
                
                else:
                        # Wrong password for user
                        return jsonify({"Error" : "1"})

        else:
            # No User Found
            return jsonify({"Error" : "2"})
    else:
        # Invalid Form
        return jsonify({"Error" : "3"})

# Admin required
@app.route('/remove', methods = ['POST'])
@login_required
@roles_required('admin')
def delete():
    
    #form = DeleteForm()
    #if form.validate_on_submit():
    s.query(User).filter(User.username == request.get_json()['username']).delete()
    s.commit()
    result = jsonify({"message": "User deleted"})
    return result 

@app.route('/isSignedIn')
def isSignedIn(): 
    
    try:
        user = s.query(User).filter(User.username == session['username']).first()
        if session['user_id']:
            return jsonify({"value" : 1})
        else:
            return jsonify({"value" : 0})
    except:
        return jsonify({"value" : 0})
    # return "You're NOT signed in"
    

# Admin required
@app.route('/update', methods = ['POST'])
@login_required
@roles_required('admin')
def update():
        
        #options = session.query(User)
        try:
            update_this = s.query(User).filter(User.username == request.get_json()['username']).first()
            update_this.first_name = request.get_json()['first_name']
            update_this.last_name = request.get_json()['last_name']
            update_this.email = request.get_json()['email']
            update_this.admin = request.get_json()['admin']
            s.commit()
            result = jsonify({'message': 'DB updated'})
            return result
        except:
            s.rollback()
            print("There was an error updating your account")
            result = jsonify({'message': 'There was an error updating your account'})
            return result
         


@app.route('/find', methods = ['POST'])
@login_required
@roles_required('admin')
def found():
    
    found_user= s.query(User).filter(User.username == request.get_json()['username']).first()
    result = {
        'found_f': found_user.first_name,
        'found_l': found_user.last_name,
        'email':found_user.email,
        'admin':found_user.admin,
        'db_ip':found_user.db_ip,
        'db_port':found_user.db_port,
        'db_username':found_user.db_username
    }
    #found_id = found_user.id
    s.commit()
    #return found_f, found_l
    return jsonify({'result':result})


@app.route('/change_password', methods=['GET', 'POST'])
@login_required
def page_change_password():
    
    change_this = s.query(User).filter(User.username == request.get_json()['username']).first()
    if check_password_hash(change_this.password,  request.get_json()['old_password']):
        hashed_password = generate_password_hash(request.get_json()['new_password'], method = 'sha256')
        change_this.password = hashed_password
        s.commit()
        result = jsonify({'message':'Password updated'})
        return result


@app.route('/user/logout', methods = ['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return "True"


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
@login_required
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
@login_required
def insert(Ntype, data):
    status = insertNode(Ntype, data, graph)
    if status == 1:
        return jsonify({"Status" : "Success"})
    else:
        return jsonify({"Status" : "Failed"})


@app.route('/api/v1/enrich/cybexCount', methods = ['POST'])
@login_required
def cybexCount():
    req = request.get_json()
    Ntype = str(req['Ntype'])
    Ntype1 = replaceType(Ntype)
    data1 = req['value']

    url = "http://cybexp1.acs.unr.edu:5000/api/v1.0/count"
    headers = {'content-type': 'application/json', 'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTQyNTI2ODcsIm5iZiI6MTU1NDI1MjY4NywianRpIjoiODU5MDFhMGUtNDRjNC00NzEyLWJjNDYtY2FhMzg0OTU0MmVhIiwiaWRlbnRpdHkiOiJpbmZvc2VjIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.-Vb_TgjBkAKBcX_K3Ivq3H2N-sVkpIudJOi2a8mIwtI'}
    data = { Ntype1 : data1 }
    data = json.dumps(data)

    r = requests.post(url, headers=headers, data=data)
    res = json.loads(r.text)
    # print(res)

    try:
        numOccur = res["count"]
        status = insertCybex(numOccur, graph, data1)
        return jsonify({"insert status" : status})

    except:
        return jsonify({"insert status" : 0})


@app.route('/api/v1/enrich/cybexRelated', methods = ['POST'])
@login_required
def CybexRelated():
    req = request.get_json()
    Ntype = str(req['Ntype'])
    Ntype1 = replaceType(Ntype)
    data1 = req['value']

    url = "http://cybexp1.acs.unr.edu:5000/api/v1.0/related/attribute/summary"
    headers = {'content-type': 'application/json', 'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTQyNTI2ODcsIm5iZiI6MTU1NDI1MjY4NywianRpIjoiODU5MDFhMGUtNDRjNC00NzEyLWJjNDYtY2FhMzg0OTU0MmVhIiwiaWRlbnRpdHkiOiJpbmZvc2VjIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.-Vb_TgjBkAKBcX_K3Ivq3H2N-sVkpIudJOi2a8mIwtI'}
    data = { Ntype1 : data1 }
    data = json.dumps(data)

    r = requests.post(url, headers=headers, data=data)
    res = json.loads(r.text)
    # print(res)

    try:
        status = insertRelated(str(res), graph, data1)
        return jsonify({"insert status" : status})

    except:
        return jsonify({"insert status" : 0})


@app.route('/api/v1/enrich/<enrich_type>/<value>')
@login_required
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
        
    elif enrich_type == "registrar":
            w_results = whois(value)
            status = getRegistrar(w_results, graph, value)
            return jsonify({"insert status" : status})

    elif enrich_type == "mailservers":
            status = getMailServer(value, graph)
            return jsonify({"insert status" : status})
    else:
        return "Invalid enrichment type. Try 'asn', 'gip', 'whois', or 'hostname'."


@app.route('/api/v1/enrichURL', methods=['POST'])
@login_required
def enrichURL():
    req = request.get_json()
    value = req['value']

    status = insert_domain(value, graph)
    return jsonify({"insert status" : status})


@app.route('/api/v1/enrich/all')
@login_required
def enrich_all():
    for node in graph.nodes.match("IP"):
        enrich('asn', node['data'])
        enrich('gip', node['data'])
        enrich('whois', node['data'])
        enrich('hostname', node['data'])
    return jsonify({"Status" : "Success"})


@app.route('/api/v1/enrichPDNS', methods=['POST'])
@login_required
def enrich_pdns():
    req = request.get_json()
    value = req['value']

    data = pdns_handler(value)
    # print(data)
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


@app.route('/admin/ratelimit')
@login_required
def ratelimit():
    # needs to use YAMLConfig
    res = requests.get('https://user.whoisxmlapi.com/service/account-balance?apiKey=at_Oj1aihFSRVU0LbyqZBLnl0PhM2Zan')
    return jsonify(res.json())

@app.route('/api/v1/admin/config')
def sendConfig():
    return jsonify(YAMLConfig)


@app.route('/api/v1/event/start', methods=['POST'])
@login_required
def startEvent():
    res = request.get_json()
    os.environ['eventName'] = res['EventName']
    
    # insert all nodes
    for node in res['IOCS']:
        status = insert(node['IOCType'], node['data'])

    # return status
    return status

# @app.route('/event/getName', methods=['GET'])
# def getEventName():
#     return jsonify(os.environ['eventName'])


@app.route('/api/v1/event/start/file', methods=['POST'])
@login_required
def startFileEvent():
    os.environ['eventName'] = request.form['eventName']

    #load csv/json file from request.files['fileNameHere]
    fileCSVDF = pd.read_csv(request.files['file'])
    
    # parse all node types and data
    # insert all nodes
    for i in range(len(fileCSVDF)):
        Ntype = str(fileCSVDF.iloc[i, 0])
        Nval = str(fileCSVDF.iloc[i, 1])
        Ntime = fileCSVDF.iloc[i, 2]

        status = insert(Ntype, Nval)

    # return status
    return jsonify(0)


@app.route('/api/v1/session/init', methods=['POST'])
@login_required
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



@app.route('/import_json', methods = ['GET','POST'])
@login_required
def import_json():
        print(request.get_data())
        data = request.files['file']
        if data:
                data.save(data.filename)
                #return 'uploaded'
                with open(data.filename) as f:
                        f1=json.load(f)
                        #print(json.dumps(f1, indent=4))
                        return jsonify(f1)


@app.route('/', methods=['GET'])
def index_root():
    return app.send_static_file('index.html')


@app.route('/api/v1/macro')
@login_required
def macro1():
    data = processExport(export(graph))
    nodes = data["Neo4j"][0][0]["nodes"]

    for node in nodes:
        value = node["properties"]["data"]
        print("--> Enriching", value)

        if node["label"] == "URL": 
            # deconstruct URL
            status = insert_domain(value, graph)
            print(str(status))

        elif node["label"] == "Email":
            # deconstruct Email
            status = insert_domain_and_user(value, graph)
            print(str(status))

        elif node["label"] == "Host":
            # resolve IP, MX, nameservers
            try:
                status1 = resolveHost(value, graph)
            except:
                print("IP resolve Error")
            try:
                status2 = getMailServer(value, graph)
            except:
                print("MX Error")
            try:
                w_results = whois(value)
                status3 = getNameservers(w_results, graph, value)
            except:
                print("Nameserver Error")
            try:
                w_results = whois(value)
                status3 = getRegistrar(w_results, graph, value)
            except:
                print("No registrar")
        
        elif node["label"] == "Domain":
            # resolve IP, MX, nameservers
            try:
                status1 = resolveHost(value, graph)
            except:
                print("IP resolve Error")
            try:
                status2 = getMailServer(value, graph)
            except:
                print("MX Error")
            try:
                w_results = whois(value)
                status3 = getNameservers(w_results, graph, value)
            except:
                print("Nameserver Error")
            try:
                w_results = whois(value)
                status3 = getRegistrar(w_results, graph, value)
            except:
                print("No registrar")

        elif node["label"] == "IP":
            # enrich all + ports + netblock 
            enrich('asn', value)
            enrich('gip', value)
            enrich('whois', value)
            enrich('hostname', value)
            # enrich cybexp needed here
            results = shodan_lookup(value)
            status1 = insert_ports(results, graph, value)

            status2 = insert_netblock(value, graph)
        
        print("Done with", str(value))

    return jsonify(nodes)


@app.route('/testAPI', methods=['POST'])
def testFunction():
    res = request.get_json()
    print(res)
    return '1'