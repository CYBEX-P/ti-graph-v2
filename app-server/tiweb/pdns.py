import json
from dnsdb_query import DnsdbClient, QueryError
import yaml
import re
from py2neo import Graph, Node, Relationship

server = 'https://api.dnsdb.info'

def pdns_handler(q=False):
    if q is False:
        return False
    
    with open('../config.yaml','r') as f:
        conf = yaml.load(f)
        
    API_KEY = conf['farsightData']['apikey']

    client = DnsdbClient(server, API_KEY)

    res = lookup_name(client, q)

    out = []
    for v in set(res):  # uniquify entries
        if ':' not in str(v):
            out.append(str(v))  

    return out


def lookup_name(client, name):
    try:
        res = client.query_rrset(name)  # RRSET = entries in the left-hand side of the domain name related labels
        for item in res:
            if item.get('rrtype') in ['A', 'AAAA', 'CNAME']:
                for i in item.get('rdata'):
                    yield(i.rstrip('.'))
            if item.get('rrtype') in ['SOA']:
                for i in item.get('rdata'):
                    # grab email field and replace first dot by @ to convert to an email address
                    yield(i.split(' ')[1].rstrip('.').replace('.', '@', 1))
    except QueryError:
        pass

    try:
        res = client.query_rdata_name(name)  # RDATA = entries on the right-hand side of the domain name related labels
        for item in res:
            if item.get('rrtype') in ['A', 'AAAA', 'CNAME']:
                yield(item.get('rrname').rstrip('.'))
    except QueryError:
        pass


def lookup_ip(client, ip):
    try:
        res = client.query_rdata_ip(ip)
        for item in res:
            yield(item['rrname'].rstrip('.'))
    except QueryError:
        pass


def introspection():
    return mispattributes


def version():
    moduleinfo['config'] = moduleconfig
    return moduleinfo

def insert_pdns(data_list, graph, value):
    reg_ex = r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"
    
    for string in data_list:
        print(string)
        flag = re.match(reg_ex, string)
        print(flag)
        if flag: # if ipv4
            c = Node("IP", data=string)
            Ip_node = graph.nodes.match("Host", data=value).first()
            c_node = graph.nodes.match("IP", data = string).first()

            if(c_node):
                    rel = Relationship(Ip_node, "LINKED_TO", c_node)
                    graph.create(rel)
                    print("Existing IP node linked")
            else:
                    graph.create(c)
                    rel = Relationship(Ip_node, "LINKED_TO", c)
                    graph.create(rel)
                    print("New IP node created and linked")
                    
        else: # if hostname
            c = Node("Host", data=string)
            Ip_node = graph.nodes.match("Host", data=value).first()
            c_node = graph.nodes.match("Host", data = string).first()

            if(c_node):
                    rel = Relationship(Ip_node, "LINKED_TO", c_node)
                    graph.create(rel)
                    print("Existing Host node linked")
            else:
                    graph.create(c)
                    rel = Relationship(Ip_node, "LINKED_TO", c)
                    graph.create(rel)
                    print("New Host node created and linked")

    return 1

# if __name__ == "__main__":
#     insert_pdns(None)
#     exit()