from py2neo import Graph, Node, Relationship
import socket

def insert_domain_and_user(emailString, graph):
    user, domain = emailString.split("@")

    c = Node("Domain", data=domain)
    email_node = graph.nodes.match("Email", data=emailString).first()
    c_node = graph.nodes.match("Domain", data = domain).first()

    if(c_node):
            rel = Relationship(email_node, "FROM_DOMAIN", c_node)
            graph.create(rel)
            print("Existing domain node linked")
    else:
            graph.create(c)
            rel = Relationship(email_node, "FROM_DOMAIN", c)
            graph.create(rel)
            print("New domain node created and linked")

    c = Node("User", data=user)
    email_node = graph.nodes.match("Email", data=emailString).first()
    c_node = graph.nodes.match("User", data = user).first()

    if(c_node):
            rel = Relationship(email_node, "FROM_USER", c_node)
            graph.create(rel)
            print("Existing user node linked")
    else:
            graph.create(c)
            rel = Relationship(email_node, "FROM_USER", c)
            graph.create(rel)
            print("New user node created and linked")


    return 1


def insert_domain(URLString, graph):
        domain = URLString.split("/")
        domain = str(domain[2])

        c = Node("Domain", data=domain)
        URL_node = graph.nodes.match("URL", data=URLString).first()
        c_node = graph.nodes.match("Domain", data = domain).first()

        if(c_node):
                rel = Relationship(URL_node, "FROM_DOMAIN", c_node)
                graph.create(rel)
                print("Existing domain node linked")
        else:
                graph.create(c)
                rel = Relationship(URL_node, "FROM_DOMAIN", c)
                graph.create(rel)
                print("New domain node created and linked")

        return 1

def insert_netblock(value, graph):
        netblock = str(value) + '/16'

        c = Node("Subnet", data=netblock)
        ip_node = graph.nodes.match("IP", data=value).first()
        c_node = graph.nodes.match("Subnet", data = netblock).first()

        if(c_node):
                rel = Relationship(ip_node, "HAS_SUBNET", c_node)
                graph.create(rel)
                print("Existing subnet node linked")
        else:
                graph.create(c)
                rel = Relationship(ip_node, "HAS_SUBNET", c)
                graph.create(rel)
                print("New subnet node created and linked")

        return 1
        
def resolveHost(node, graph):
        try:
                host = socket.gethostbyname(node)

                i = Node("IP", data = host)
                host_node = graph.nodes.match("Host", data=node).first()
                i_node = graph.nodes.match("IP", data=host).first()

                if(i_node):
                        rel = Relationship(host_node, "IS_RELATED_TO", i_node)
                        graph.create(rel)
                        print("Existing IP node linked")

                else:
                        graph.create(i)
                        rel = Relationship(host_node, "IS_RELATED_TO", i)
                        graph.create(rel)
                        print("New IP node created and linked", host)
                
                return 1

        except:
                print("No IP Entry for {}".format(node))
                return 0


def getNameservers(data, graph, value):
        if(data != 0):
                try:
                        values = data["WhoisRecord"]["nameServers"]["hostNames"]
                except:
                        print("No nameservers for this host")
                        return 0
                        
                for i in values:
                        # print(i)
                        try:
                                c = Node("Nameserver", data = i)
                                host_node = graph.nodes.match("Host", data=value).first()
                                c_node = graph.nodes.match("Nameserver", data = i).first()

                                if(c_node):
                                        rel = Relationship(host_node, "HAS", c_node)
                                        graph.create(rel)
                                        print("Existing Nameserver node linked")

                                else:
                                        graph.create(c)
                                        rel = Relationship(host_node, "HAS", c)
                                        graph.create(rel)
                                        print("New Nameserver node created and linked")
                                
                        except:
                                print("Error with cycling through nameservers")
                return 1
        else:
                print("No Whois for this Host")
                return 0
# if __name__ == "__main__":
#         value = input("Enter Full URL: ")
#         print(insert_domain(value, 1))