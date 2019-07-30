/**
 * This is a HOC for the radial menu.
 * See:
 * https://reactjs.org/docs/higher-order-components.html
 */

import React from 'react';
import axios from 'axios';



function withNodeType(RadialMenuComponent, nodeType, setNeo4jData, config) {
  if (nodeType === null) {
    return <></>;
  }

  function EnrichIPbyType(type) {
    if (type !== "pdns" && type !== "enrichURL")
    {
      axios.get(`/api/v1/enrich/${type}/${nodeType.properties.data}`).then(({ data }) => {
        if (data['insert status'] !== 0) {
          axios.get('/api/v1/neo4j/export').then(response => {
            setNeo4jData(response.data);
          });
        }
      });
    }
    else if (type === "pdns"){
      axios
        .post(`/api/v1/enrichPDNS`, {value: `${nodeType.properties.data}`})
        .then(({ data }) => {
          if (data['insert status'] !== 0) {
            axios
              .get('/api/v1/neo4j/export')
              .then(response => {
                setNeo4jData(response.data);
              })
          }
        }); 
    }
    else if (type === "enrichURL"){
      axios
        .post(`/api/v1/enrichURL`, {value: `${nodeType.properties.data}`})
        .then(({ data }) => {
          if (data['insert status'] !== 0) {
            axios
              .get('/api/v1/neo4j/export')
              .then(response => {
                setNeo4jData(response.data);
              });
          }
        });
    }
  }

  // function EnrichIPAll() {
  //   config.enrichments.IP.map(enrichmentType => {
  //     axios.get(`/api/v1/enrich/${enrichmentType}/${nodeType.properties.data}`).then(({ data }) => {
  //       if (data['insert status'] !== 0) {
  //         axios.get('/api/v1/neo4j/export').then(response => {
  //           setNeo4jData(response.data);
  //         });
  //       }
  //     });
  //     return true;
  //   });
  // }

  let icons = [];
  let onClickFns = [];
  let titles = [];
  // if (nodeType.label === 'IP') {
  //   // We could probably find a way to do this by YAML instead of hardcoding it
  //   onClickFns = config.enrichments.IP.map(enrichmentType => () => {
  //     return EnrichIPbyType(enrichmentType);
  //   });
  //   // Copy arrays
  //   titles = config.enrichments.IP.map(val => val);
  //   titles.push('all');
  //   icons = titles.map(val => val);
  //   onClickFns.push(() => EnrichIPAll());
  // }
  // return props => {
  //   return <RadialMenuComponent titles={titles} icons={icons} onClickFunctions={onClickFns} {...props} />;
  // };
    
  onClickFns = config.enrichments[`${nodeType.label}`].map(enrichmentType => () => {
    return EnrichIPbyType(enrichmentType);
  });
  // Copy arrays
  titles = config.enrichments[`${nodeType.label}`].map(val => val);
  icons = titles.map(val => val);
  return props => {
    return <RadialMenuComponent titles={titles} icons={icons} onClickFunctions={onClickFns} {...props} />;
  };
}

export default withNodeType;
