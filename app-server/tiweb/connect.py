from py2neo import Graph

# development connection
def connectDev():
    graph = Graph("bolt://127.0.0.1:7687", auth=("neo4j", "wolfpack"))
    return graph

# Production connection
# connect to user's individual container 
def connectProd(user, passw, addr, port):
    URI = "bolt://" + addr + ":" + str(port)
    graph = Graph(URI, auth=(user, passw))
    return graph
