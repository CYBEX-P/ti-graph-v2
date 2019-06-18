import React, { useState, useContext, useEffect } from 'react';
import { Network } from 'vis';
import PropTypes from 'prop-types';
import { CircleLoader } from 'react-spinners';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';

import NetworkContext from '../App/DataContext';
import RadialMenu from '../radialMenu/radialMenu';
import withNodeType from '../radialMenu/withNodeType';

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
          y: e.event.clientY
        });
      }
      return setHoverText(null);
    });
    // blurNode fires when leaving a node
    nw.on('blurNode', () => setHoverText(null));

    // Change the selection state whenever a node is selected and deselected
    nw.on('deselectNode', () => setSelection(nw.getSelection()));
    nw.on('selectNode', () => {
      setSelection(nw.getSelection());
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
          display: 'grid'
        }}
      />
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
                backgroundColor: '#111',
                pointerEvents: 'none'
              }}>
          <Card>
            <CardBody>
              <CardTitle style={{textAlign:"center"}}><b>Node Data</b></CardTitle>
              <hr/>
              <CardText>{hoverText.text}</CardText>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

Graph.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Graph;
