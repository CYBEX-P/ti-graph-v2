from py2neo import Graph, Node, Relationship

def insertCybex(data, graph, ip):

    c = Node("CybexCount", data = data)
    ip_node = graph.nodes.match("IP", data=ip).first()
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

def insertRelated(data, graph, ip):

    c = Node("CybexRelated", data = data)
    ip_node = graph.nodes.match("IP", data=ip).first()
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
