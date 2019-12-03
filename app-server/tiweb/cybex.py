from py2neo import Graph, Node, Relationship
import json

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

# Description: Adds Cybex Count and Malicious Count to node data
# Parameters: <int>numOccur - Cybex Count query response
#             <int>numMal - Cybex Count Malicious query response
#             <object>graph - The current graph
#             <string>Ntype - The type of the originating node
#             <string>data - JSON data for the originating node
# Returns: 1 if successful
# Author: Adam Cassell
def insertCybexCount(numOccur,numMal,graph,Ntype,value):
    #c = Node("CybexCount", data = data)
    ip_node = graph.nodes.match(data=value).first()
    print(ip_node)
    #c_node = graph.nodes.match(Ntype, data = data).first()

    if(ip_node):
            ip_node["count"] = numOccur
            ip_node["countMal"] = numMal
            # if (numMal/numOccur > 0):
            #     ip_node["color"] = 'rgba(168, 50, 50)'
            node.clear_labels()
            graph.push(ip_node)
            # rel = Relationship(ip_node, "HAS_OCCURED", c_node)
            # graph.create(rel)
            print("CybexCount added to node")
    else:
            # graph.create(c)
            # rel = Relationship(ip_node, "HAS_OCCURED", c)
            # graph.create(rel)
            #print("New CybexCount node created and linked")
            print("Error adding CybexCount")

    return 1

# Description: Attaches nodes to an object for all related attributes queried from Cybex
# Parameters: <string>data - JSON response string from the Related Attribute Summary API call
#             <object>graph - The current graph
#             <string>value - JSON data for the originating node
# Returns: 1 if successful
# Author: Adam Cassell
def insertRelatedAttributes(data,graph,value):
    data = data.replace("'",'"',) # Converts strin to proper JSON using "" instead of ''
    dataDict = json.loads(data) # convert json string to dict
    for attr,val in dataDict["data"].items(): # iterate over all related attributes..
        valString = ""
        for each in val:
            valString = valString + str(each) + ','
        valString = valString[:-1] # remove trailing comma
        nodeData = attr + ": " + valString # currently only using value
        nodeData = valString
        c = Node(attr, data = nodeData)
        ip_node = graph.nodes.match(data=value).first()
        c_node = graph.nodes.match(attr, data = nodeData).first()

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
