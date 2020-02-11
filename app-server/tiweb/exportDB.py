from py2neo import Graph, Node, Relationship
import os
import json


def processExport(dataObject):
    for x in dataObject["Neo4j"][0]:
        for key in x['nodes']:
            #print(x['nodes'])
            # Before assigning color, referene malicious counts to assign threat level.
            threatLevel = -1 #default to -1 for inconclusive threat level
            if 'countMal' in str(key):
                if (key['properties']['countMal'] != 0) and (key['properties']['count'] != 0):
                    ratioMal = key['properties']['countMal']/(key['properties']['count'] + key['properties']['countMal'])
                    if ratioMal == 0:
                        threatLevel = 0
                    elif 0 < ratioMal < 0.5:
                        threatLevel = 1
                    elif 0.5 <= ratioMal <= 1:
                        threatLevel = 2
                    # else: 
                    #     threatLevel = 0
            key['label'] = key['label'][0]
            if key['label'] == 'IP':
                key['image'] = '/static/SVG/DataAnalytics/svg_ip.svg'
                if threatLevel == 0:
                    key['color'] = 'rgba(151,252,158,1)'
                elif threatLevel == 1:
                    key['color'] = 'rgba(255,222,0,1)'
                elif threatLevel == 2:
                    key['color'] = 'rgba(168,50,50,1)'
                else:
                    #key['color'] = "#B37469"
                    #key['color'] = 'rgba(151,252,158,1)'
                    key['color'] = 'rgba(151,194,252,1)'
                #key['widthConstraint'] = 120
            elif key['label'] == 'Host':
                key['image'] = '/static/SVG/DataAnalytics/svg_host.svg'
                #key['color'] = '#FB7E81'
                #key['color'] = 'rgba(247, 151, 77, 1)'
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'URL':
                if threatLevel == 0:
                    key['color'] = 'rgba(151,252,158,1)'
                elif threatLevel == 1:
                    key['color'] = 'rgba(255,222,0,1)'
                elif threatLevel == 2:
                    key['color'] = 'rgba(168,50,50,1)'
                else:
                    #key['color'] = "#B37469"
                    #key['color'] = 'rgba(151,252,158,1)'
                    key['color'] = 'rgba(151,194,252,1)'
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
                key['image'] = '/static/SVG/DataAnalytics/svg_asn.svg'
            elif key['label'] == 'Country':
                #key['color'] = '#F4A259'
                #key['color'] = 'rgba(247, 151, 77, 1)'
                key['color'] = 'rgba(151,194,252,1)'
                key['image'] = '/static/SVG/DataAnalytics/svg_country_alt.svg'
            elif key['label'] == 'BTC':
                key['color'] = '#3185FC'
            elif key['label'] == 'MAC':
                key['color'] = '#DDF8E8'
            elif key['label'] == 'BGPath':
                key['color'] = '#28AFB0'
            elif key['label'] == 'SSID':
                key['color'] = '#E8E8E8'
            elif key['label'] == 'Domain':
                if threatLevel == 0:
                    key['color'] = 'rgba(151,252,158,1)'
                elif threatLevel == 1:
                    key['color'] = 'rgba(255,222,0,1)'
                elif threatLevel == 2:
                    key['color'] = 'rgba(168,50,50,1)'
                else:
                    #key['color'] = "#B37469"
                    #key['color'] = 'rgba(151,252,158,1)'
                    key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Ports':
                key['image'] = '/static/SVG/DataAnalytics/svg_ports.svg'
                #key['color'] = "#ff41e2"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Whois':
                #key['color'] = "#4070f4"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Subnet':
                key['image'] = '/static/SVG/DataAnalytics/svg_subnet.svg'
                #key['color'] = "#eeee58"
                key['color'] = 'rgba(151,194,252,1)'
            elif key['label'] == 'Registrar':
                key['color'] = "#06de9e"
            elif key['label'] == 'Nameserver':
                key['color'] = "#cf4cf3"
            elif key['label'] == 'MailServer':
                key['color'] = 'rgba(151,194,252,1)'
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
                # key['color'] = 'rgba(151,194,252,1)'
                #key['shape'] = 'hexagon'
                key['color'] = 'rgba(255,255,255,1)'
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
