from py2neo import Graph, Node, Relationship

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
        
# if __name__ == "__main__":
#         value = input("Enter Full URL: ")
#         print(insert_domain(value, 1))