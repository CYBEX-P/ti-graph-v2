from py2neo import Graph, Node, Relationship
import os
import json


def processExport(dataObject):

    for x in dataObject["Neo4j"][0]:
        for key in x['nodes']:
            key['label'] = key['label'][0]
            if key['label'] == 'IP':
                key['color'] = '#97C2FC'
            if key['label'] == 'Host':
                key['color'] = '#FB7E81'
            if key['label'] == 'URL':
                key['color'] = '#D496A7'
            if key['label'] == 'SPort':
                key['color'] = '#8C99CE'
            if key['label'] == 'DPort':
                key['color'] = '#5B8E7D'
            if key['label'] == 'Email':
                key['color'] = '#34E5FF'
            if key['label'] == 'Hash':
                key['color'] = '#FDF5BF'
            if key['label'] == 'ASN':
                key['color'] = '#8CB369'
            if key['label'] == 'Country':
                key['color'] = '#F4A259'
            if key['label'] == 'BTC':
                key['color'] = '#3185FC'
            if key['label'] == 'MAC':
                key['color'] = '#DDF8E8'
            if key['label'] == 'BGPath':
                key['color'] = '#28AFB0'
            if key['label'] == 'SSID':
                key['color'] = '#E8E8E8'


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
