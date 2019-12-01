import React, { useState, useContext, useEffect } from 'react';
import { Network } from 'vis';
import PropTypes from 'prop-types';
import { CircleLoader } from 'react-spinners';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';

import NetworkContext from '../App/DataContext';
import RadialMenu from '../radialMenu/radialMenu';
import withNodeType from '../radialMenu/withNodeType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function InitializeGraph(data) {
  if (typeof data.Neo4j === 'undefined') {
    return null;
  }
  const { nodes } = data.Neo4j[0][0];
  const { edges } = data.Neo4j[1][0];
  const dataObject = { nodes, edges };

  const options = {
    layout: { improvedLayout: true },
    height: '99vh',
    nodes: {
      shape: 'circle',
      widthConstraint: 100,
      font:{color:'white'}
    },
    edges: {
      length: 200
    },
    interaction: {
      hover: true,
      hoverConnectedEdges: false
    }
  };
  const container = document.getElementById('mynetwork');
  const nw = new Network(container, dataObject, options);
  return nw;
}

const Graph = ({ isLoading }) => {
  const { neo4jData, setNeo4jData, config } = useContext(NetworkContext);

  const [isStabilized, setIsStabilized] = useState(true);
  const [dragStart, setDragStart] = useState(false);

  const [hoverText, setHoverText] = useState(null);
  // selctText is like hoverText, but is to be persistently shown when node is selected
  const [selectText, setSelectText] = useState(null);
  const [selection, setSelection] = useState({ nodes: [], edges: [] });
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [radialPosition, setRadialPosition] = useState(null);
  const [eventListenersAdded, setEventListenersAdded] = useState(false);

  const [network, setNetwork] = useState(null);

  function UpdatePositions() {
    if (network === null || selection === null) {
      return setRadialPosition(null);
    }
    if (typeof selection.nodes[0] === 'undefined') {
      return setRadialPosition(null);
    }
    // Returns the id of the current node selected, not the index
    const selectedNode = selection.nodes[0];
    const canvasPositions = network.getPositions(selection.nodes)[selectedNode];
    const domPositions = network.canvasToDOM(canvasPositions);
    setSelectedNodeType(neo4jData.Neo4j[0][0].nodes.filter(properties => properties.id === selection.nodes[0])[0]);
    return setRadialPosition(domPositions);
  }

  function AddEventListenersToNetwork(nw, data) {
    if (typeof data.Neo4j === 'undefined') {
      return false;
    }
    if (nw === null) {
      return false;
    }
    // hoverNode fires whenever the mouse hovers over a node
    nw.on('hoverNode', e => {
      if (typeof data.Neo4j !== 'undefined') {
        return setHoverText({
          // Set the hover text to the properties of the data
          text: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === e.node)[0].properties),
          x: e.event.clientX,
          y: e.event.clientY,
          data: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === e.node)[0].properties.data),
          label: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === e.node)[0].label),
          color: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === e.node)[0].color),
        });
      }
      return setHoverText(null);
    });
    // blurNode fires when leaving a node
    nw.on('blurNode', () => setHoverText(null));

    // Change the selection state whenever a node is selected and deselected
    nw.on('deselectNode', (params) => 
    {
      setSelection(nw.getSelection())
      Object.keys(nw.body.nodes).forEach(function(currentId){
        if (!currentId.includes("edgeId"))
        {
          var orgColorStr = nw.body.nodes[currentId].options.color.background;
          // split color string into array with indices corresponding to r,g,b, and a
          var orgColorArr = orgColorStr.split('(')[1].split(')')[0].split(',');
          var opacityNormal = 1;
          nw.body.nodes[currentId].options.color.background = 'rgb('+orgColorArr[0]+',' + orgColorArr[1] + ',' + orgColorArr[2]+','+opacityNormal+')';
        }
      });
      setSelectText({
        label: "No Node Selected",
        text: '',
        data: "Select a node to see details.",
        color: "white",
        count: 'X',
        countMalicious: 'X'
      })
    });
    nw.on('selectNode', (params) => {
      setSelection(nw.getSelection());
      var opacityBlurred = 0.1;
      //console.log(nw.body.nodes)
      var nodeId = params.nodes[0];
      Object.keys(nw.body.nodes).forEach(function(currentId){
        if (!currentId.includes("edgeId"))
        {
          if (currentId != nodeId)
          {
            var orgColorStr = nw.body.nodes[currentId].options.color.background;
            // split color string into array with indices corresponding to r,g,b, and a
            var orgColorArr = orgColorStr.split('(')[1].split(')')[0].split(',');
            nw.body.nodes[currentId].options.color.background = 'rgb('+orgColorArr[0]+',' + orgColorArr[1] + ',' + orgColorArr[2]+','+opacityBlurred+')';
            nw.body.nodes[currentId].options.color.border = 'rgb('+orgColorArr[0]+',' + orgColorArr[1] + ',' + orgColorArr[2]+','+opacityBlurred+')';
          }
        }
      });
      setSelectText({
        // Set the select text to the properties of the data
        text: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === nodeId)[0].properties),
        data: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === nodeId)[0].properties.data),
        label: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === nodeId)[0].label),
        color: JSON.stringify(data.Neo4j[0][0].nodes.filter(properties => properties.id === nodeId)[0].color),
        count: 'X',
        countMalicious: 'X'
      });
    });
  

    // Set state when drag starts and ends. Used to determine whether to draw radial menu or not
    nw.on('dragStart', () => {
      setDragStart(true);
    });
    nw.on('dragEnd', () => {
      setDragStart(false);
    });

    // Similar to dragStart and dragEnd, but changes the selection state during stabilization
    nw.on('startStabilizing', () => {
      setSelection({ nodes: [], edges: [] });
      setIsStabilized(false);
    });
    nw.on('stabilized', () => {
      setSelection(nw.getSelection());
      setIsStabilized(true);
    });

    // We just get rid of the selection and radial menu on zoom since there isn't a good way to tell
    // when zoom ends and begins
    nw.on('zoom', () => {
      setRadialPosition(null);
      if (selection !== null) {
        nw.unselectAll();
        setSelection(null);
      }
    });
    return true;
  }

  useEffect(() => {
    if (!dragStart) {
      return UpdatePositions();
    }
    return setRadialPosition(null);
  }, [dragStart]);

  useEffect(() => {
    if (isStabilized) {
      return UpdatePositions();
    }
    return setRadialPosition(null);
  }, [isStabilized]);

  useEffect(() => {
    if (typeof neo4jData.Neo4j !== 'undefined') {
      setNetwork(InitializeGraph(neo4jData));
      setEventListenersAdded(false);
      setRadialPosition(null);
    }
  }, [neo4jData]);

  useEffect(() => {
    if (eventListenersAdded === false) {
      setEventListenersAdded(AddEventListenersToNetwork(network, neo4jData));
    }
  }, [network, neo4jData]);

  useEffect(() => {
    if (selection === null) {
      setSelectedNodeType(null);
      return setRadialPosition(null);
    }
    if (selection.nodes.length !== 0) {
      return UpdatePositions();
    }
    setSelectedNodeType(null);
    return setRadialPosition(null);
  }, [selection]);

  // HOC that returns the radial menu to use
  const RadialToRender = withNodeType(RadialMenu, selectedNodeType, setNeo4jData, config);
  

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px auto' }}>
      <div
        id="mynetwork"
        role="presentation"
        style={{
          width: '100%',
          height: '100vh',
          gridRow: '1 / span 2',
          gridColumn: 1,
          zIndex: 2,
          display: 'grid',
          backgroundColor: '#232323'
        }}
      />
      <div style={{
          position:"absolute",
          width:"300px", 
          right:"10px",
          top:"65px",
          zIndex: 5,
          // backgroundColor: '#111', // Used for classic Card styling only.
          pointerEvents: 'none',
          backgroundColor: "black",
          color: "white",
          opacity: "0.95",
          borderRadius: "10px",
          padding: "10px",
          paddingBottom: "20px",
          boxShadow: "0px 2px 5px 0px rgba(31,30,31,1)"
          }}>
            <h4 style={{textAlign:"center"}}>
              <b>Filters</b>
            </h4>
            <hr/>
            <h5>Time</h5>
            <div style={{color:"white",fontSize:"large"}}>
              From: <input style={{width:'70px'}}></input> To: <input style={{width:'70px'}}></input>
            </div>
          </div>
      {isLoading && (
        <div
          style={{
            gridRow: '2',
            gridColumn: 1,
            backgroundColor: '#e0e0e0dd',
            zIndex: 10,
            display: 'grid'
          }}
        >
          <div style={{ justifySelf: 'center', alignSelf: 'end', fontSize: '24px', width: '80px' }}>Loading</div>
          <div
            style={{
              alignSelf: 'start',
              justifySelf: 'center'
            }}
          >
            <CircleLoader color="#00cbcc" />
          </div>
        </div>
      )}
      {radialPosition && <RadialToRender position={radialPosition} network={network} scale={network.getScale()} />}
      {hoverText && (
        <div
          style={{
                position: 'absolute',
                zIndex: 1000,
                top: hoverText.y,
                left: hoverText.x,
                // backgroundColor: '#111', // Used for classic Card styling only.
                pointerEvents: 'none',
                backgroundColor: "black",
                color: "white",
                opacity: "0.95",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0px 2px 5px 0px rgba(31,30,31,1)"
              }}>
          <h4 style={{
            textAlign:"center",
            color: hoverText.color.replace(/"/g,""),
            textShadow: "-1px 0 grey, 0 1px grey, 1px 0 grey, 0 -1px grey"
          }}>
            <b>{hoverText.label.replace(/"/g,"")}</b>
          </h4>
          <hr/>
          <h6 style={{textAlign:"center"}}>{hoverText.data.replace(/"/g,"")}</h6>
          <div style={{color:"white",fontSize:"large",textAlign:"center"}}>
            <FontAwesomeIcon size="1x" icon={faExclamationCircle} style={{marginRight:"3px"}}/>
            X% malicious
          </div>
        </div>
      )}
      {selectText && (
        <div style={{
          position:"absolute",
          width:"300px", 
          right:"10px",
          bottom:"10px",
          zIndex: 5,
          // backgroundColor: '#111', // Used for classic Card styling only.
          pointerEvents: 'none',
          backgroundColor: "black",
          color: "white",
          opacity: "0.95",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "0px 2px 5px 0px rgba(31,30,31,1)"
          }}>
          <h4 style={{
            textAlign:"center",
            color: selectText.color.replace(/"/g,""),
            //textShadow: "-1px 0 grey, 0 1px grey, 1px 0 grey, 0 -1px grey"
          }}>
            <b>{selectText.label.replace(/"/g,"")}</b>
          </h4>
          <h6 style={{textAlign:"center"}}>{selectText.data.replace(/"/g,"")}</h6>
          <hr/>
          <div style={{color:"white",fontSize:"large"}}>
            <h5>Details</h5>
            <h6>Cybex Count:</h6>
            <FontAwesomeIcon size="1x" icon={faExclamationCircle} style={{marginRight:"3px"}}/>
              Total = {selectText.count}, Malicious = {selectText.countMalicious}<br></br>
            <hr/>
            <h5>View Options</h5>
            <h6>Highlight Related:</h6>
            <button style={{marginRight:'10px'}}>Attributes</button>
            <button>Events</button>
          </div>
        </div>
      )}
    </div>
  );
};

Graph.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Graph;
