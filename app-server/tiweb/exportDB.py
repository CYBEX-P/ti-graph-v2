from py2neo import Graph, Node, Relationship
import os
import json


def processExport(dataObject):

    for x in dataObject["Neo4j"][0]:
        for key in x['nodes']:
            key['label'] = key['label'][0]
            if key['label'] == 'IP':
                #key['color'] = '#97C2FC',
                #key['color'] = 'rgba(151,194,252,1)'
                key['color'] = 'rgba(151,252,158,1)'
                #key['widthConstraint'] = 120
            elif key['label'] == 'Host':
                #key['color'] = '#FB7E81'
                #key['color'] = 'rgba(247, 151, 77, 1)'
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'URL':
                #key['color'] = '#D496A7'
                #key['color'] = 'rgba(151,194,252,1)'
                key['color'] = 'rgba(151,252,158,1)'
            elif key['label'] == 'SPort':
                key['color'] = '#8C99CE'
            elif key['label'] == 'DPort':
                key['color'] = '#5B8E7D'
            elif key['label'] == 'Email':
                #key['color'] = '#34E5FF'
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Hash':
                key['color'] = '#FDF5BF'
            elif key['label'] == 'ASN':
                #key['color'] = '#8CB369'
                #key['color'] = 'rgba(168, 50, 50)'
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Country':
                #key['color'] = '#F4A259'
                #key['color'] = 'rgba(247, 151, 77, 1)'
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'BTC':
                key['color'] = '#3185FC'
            elif key['label'] == 'MAC':
                key['color'] = '#DDF8E8'
            elif key['label'] == 'BGPath':
                key['color'] = '#28AFB0'
            elif key['label'] == 'SSID':
                key['color'] = '#E8E8E8'
            elif key['label'] == 'Domain':
                #key['color'] = "#B37469"
                #key['color'] = 'rgba(151,194,252,1)'
                key['color'] = 'rgba(151,252,158,1)'
            elif key['label'] == 'Ports':
                #key['color'] = "#ff41e2"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Whois':
                #key['color'] = "#4070f4"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Subnet':
                #key['color'] = "#eeee58"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Registrar':
                key['color'] = "#06de9e"
            elif key['label'] == 'Nameserver':
                key['color'] = "#cf4cf3"
            elif key['label'] == 'MailServer':
                key['color'] = "#835eba"
            elif key['label'] == 'User':
                key['color'] = "#d8e5f6"
            elif key['label'] == 'CybexCount':
                #key['color'] = "#29e682"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'CybexRelated':
                #key['color'] = "#92fd6c"
                key['color'] = 'rgba(151,194,252,1)'
                key['shape'] = 'hexagon'
            else:
                key['color'] = 'rgba(151,194,252,1)'
                key['shape'] = 'hexagon'
                #key['color'] = 'rgba(151,252,158,1)', 
            

    return dataObject

    #Added limit of 10 nodes and edges just for testing on full cybexp2 graph -- jeffs 
    # "collect(blah blah blah)[..10] AS edges..."

def export(graph):
    r_response = graph.run("MATCH (a)-[r]->(b) \
        WITH collect( \
            { \
                from: id(a), \
                to: id(b), \
                type: type(r) \
            } \
        ) AS edges \
        RETURN edges").data()

    n_response = graph.run("MATCH (a) WITH collect( \
            { \
                    id: id(a), \
                    label: labels(a), \
                    properties: properties(a) \
            } \
        ) AS nodes RETURN nodes").data()

    return {"Neo4j": [n_response, r_response]}
