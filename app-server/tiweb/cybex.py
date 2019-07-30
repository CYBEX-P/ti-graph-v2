from py2neo import Graph, Node, Relationship

def insertCybex(data, graph, value):
    
    c = Node("CybexCount", data = data)
    ip_node = graph.nodes.match(data=value).first()
    c_node = graph.nodes.match("CybexCount", data = data).first()

    if(c_node):
            rel = Relationship(ip_node, "HAS_OCCURED", c_node)
            graph.create(rel)
            print("Existing CybexCount node linked")
    else:
            graph.create(c)
            rel = Relationship(ip_node, "HAS_OCCURED", c)
            graph.create(rel)
            print("New CybexCount node created and linked")

    return 1

def insertRelated(data, graph, value):

    c = Node("CybexRelated", data = data)
    ip_node = graph.nodes.match(data=value).first()
    c_node = graph.nodes.match("CybexRelated", data = data).first()

    if(c_node):
            rel = Relationship(ip_node, "HAS_OCCURED", c_node)
            graph.create(rel)
            print("Existing CybexRelated node linked")
    else:
            graph.create(c)
            rel = Relationship(ip_node, "HAS_OCCURED", c)
            graph.create(rel)
            print("New CybexRelated node created and linked")

    return 1

def replaceType(value):
    if value == "Email":
        return "email_addr"
    elif value == "Host":
        return "hostname"
    elif value == "URL":
        return "uri"
    elif value == "User":
        return "username"
    else: 
        return value.lower()
