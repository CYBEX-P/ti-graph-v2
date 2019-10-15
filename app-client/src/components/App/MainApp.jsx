import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlayCircle, faInfoCircle, faTimesCircle, faInfo } from '@fortawesome/free-solid-svg-icons';

import { Container, Row } from 'reactstrap';

import NavBar from '../navBar/navBar';
import MenuBar from '../menuBar/menuBar';
import { AppContainer, ContentContainerStyle } from '../__styles__/styles';
import MenuContext from './MenuContext';
import ModalContext from './ModalContext';
import DataContext from './DataContext';
import GraphModal from '../modal/graphModal';
import Graph from '../Graph/Graph';
import Button from '../Button/Button';
import InsertForm from '../forms/InsertForm/InsertForm';
import EventInsertForm from '../EventInsertForm/EventInsertForm';
import ImportJson from '../forms/InsertForm/ImportJson'

const App = props => {
  const [isLoading, setLoading] = useState(false);

  const [isExpanded, dispatchExpand] = useReducer((_, action) => {
    if (action === 'left' || action === 'right' || action === 'bottom' || action === 'top') {
      return action;
    }
    return 'none';
  }, 'none');

  const [isShowingModal, dispatchModal] = useReducer((state, action) => {
    if (state === action) {
      return state;
    }
    return action;
  }, false);

  const [neo4jData, setNeo4jData] = useState({});

  const [errorToDisplay, setError] = useState(null);

  const [macroDetails,setMacroDetails] = useState('none');
  
  // Get data on first render
  useEffect(() => {
    axios.get('/api/v1/neo4j/export').then(({ data }) => {
      setNeo4jData(data);
    });
  }, []);

  return (
    <MenuContext.Provider value={{ isExpanded, dispatchExpand, setLoading }}>
      <ModalContext.Provider value={{ isShowingModal, dispatchModal, setError }}>
        <DataContext.Provider value={{ config: props.config, neo4jData, setNeo4jData }}>
          {/* Keep modals here */}
          <GraphModal title="example" contentLabel="Example Modal">
            <div>Content will go here soon!</div>
          </GraphModal>
          <GraphModal title="Neo4j Data" contentLabel="Neo4j Data">
            <div>{JSON.stringify(neo4jData)}</div>
          </GraphModal>
          <GraphModal title="Database Management" contentLabel="Database Management">
            <div>
              <Button
                width="128px"
                onClickFunction={() => {
                  axios.get('/api/v1/neo4j/wipe').then(() => {
                    axios.get('/api/v1/neo4j/export').then(({ data }) => {
                      setNeo4jData(data);
                      dispatchModal('none');
                    });
                  });
                }}
              >
                Wipe DB
              </Button>
            </div>
          </GraphModal>
          <GraphModal afterCloseFn={() => setError(null)} title="Error" contentLabel="Error">
            <div style={{ textAlign: 'center' }}>
              <FontAwesomeIcon icon="meh" size="10x" />
              <br />
              Oops! An error occured!
              <div style={{ color: '#ff4300' }}>{errorToDisplay}</div>
            </div>
          </GraphModal>

          <GraphModal title="New Event Form">
            <Container>
              <ModalContext.Consumer>
                {dispatchModal => (
                  <DataContext.Consumer>
                    {setNeo4jData => (
                      <EventInsertForm config={props.config} setNeo4jData={setNeo4jData} dispatchModal={dispatchModal}/>
                    )}
                  </DataContext.Consumer>
                )}
              </ModalContext.Consumer>
            </Container>
          </GraphModal>

          <AppContainer>
            <ContentContainerStyle>
              <Graph isLoading={isLoading} />
            </ContentContainerStyle>
            <NavBar />
            <MenuBar side="left" icon="search">
              <h3 style={{paddingLeft: "20%", paddingRight: "25%", marginLeft: "20%", marginTop: "5%",color:"white"}}>Macros</h3>
              <hr style={{marginLeft: "12.5%"}}/>
              <div style={{marginLeft: "20%", marginTop: "5%", backgroundColor: "white",borderRadius:'5px',padding:'5px',paddingLeft:"20%",boxShadow: "0px 2px 5px 0px rgba(31,30,31,1)"}}>
                Macro 1
                <div
                  style={{display:"inline"}}
                  >
                  <div
                    style={{display:"inline"}}
                    onClick={() => {
                      setLoading(true);
                      axios.get('/api/v1/macro')
                      .then(() => {
                        axios
                          .get('/api/v1/neo4j/export')
                          .then(({ data }) => {
                            setNeo4jData(data);
                            setLoading(false);
                          })
                          .catch(() => {
                            dispatchModal('Error');
                            setLoading(false);
                          });
                        })
                        //setLoading(false);
                      }}
                  >
                    <FontAwesomeIcon 
                      size="lg" 
                      icon={faPlayCircle} 
                      color="" 
                      style={{marginLeft:"3%",float:'right'}}/>
                    </div>
                    <div style={{display:"inline"}} onClick={() => setMacroDetails('macro1')}>
                      <FontAwesomeIcon size="lg" icon={faInfoCircle} color={macroDetails == "macro1" && "#0277bd"} style={{marginLeft:"3%",float:'right'}}/>
                    </div> 
                </div>  
              </div>
              <div style={{marginLeft: "20%", marginTop: "5%", backgroundColor: "white",borderRadius:'5px',padding:'5px',paddingLeft:"20%",boxShadow: "0px 2px 5px 0px rgba(31,30,31,1)"}}>
                Macro 2
                <div style={{display:"inline"}}>
                  <FontAwesomeIcon 
                    size="lg" 
                    icon={faPlayCircle} 
                    color="" 
                    style={{marginLeft:"3%",float:'right'}}/>
                </div>
                <div style={{display:"inline"}} onClick={() => setMacroDetails('macro2')}>
                  <FontAwesomeIcon size="lg" icon={faInfoCircle} color={macroDetails == "macro2" && "#0277bd"} style={{marginLeft:"3%",float:'right'}}/>
                </div>
              </div>  
              {/* <div style={{backgroundColor:'white',padding: "5%", marginLeft: "20%", marginTop: "45%",marginBottom: "5%",borderRadius:'5px',boxShadow: "0px -2px 5px 0px rgba(31,30,31,1)"}}>
                <h5 style={{textAlign:'center'}}>Macro 1 Details</h5>
                <hr></hr>
                <div style={{height:'20vh',overflow:'auto'}}>
                  <h6>URL</h6>
                  <ul>
                    <li>Deconstruct URL</li>
                  </ul>
                </div>
              </div> */}
                {macroDetails == "macro1" &&
                  <div style={{position: "fixed", minHeight:"25%", width: '40%',top:'56px', left: "334px",padding: '10px',backgroundColor:"white",opacity:'0.9',borderRadius:'15px',border:'solid',borderColor:'#0277bd'}}>
                    <div onClick={() => setMacroDetails("none")}>
                      <FontAwesomeIcon size="2x" icon={faTimesCircle} style={{float:'right'}}/>
                    </div>
                    <FontAwesomeIcon size="2x" icon={faInfoCircle} style={{float:'left',color:'#0277bd'}}/>
                    <h4 style={{textAlign:'center'}}>Macro 1 Details</h4>
                    <hr></hr>
                    <div style={{display:'inline-block',margin:'10px'}}>
                      <h6>URL</h6>
                      <ul>
                        <li>Deconstruct URL</li>
                      </ul>
                    </div>
                    <div style={{display:'inline-block',margin:'10px'}}>
                      <h6>Email</h6>
                      <ul>
                        <li>Deconstruct Email</li>
                      </ul>
                    </div>
                    <div style={{display:'inline-block',margin:'10px'}}>
                      <h6>Host</h6>
                      <ul>
                        <li>Resolve IP</li>
                        <li>Resolve MX</li>
                        <li>Resolve Nameservers</li>
                      </ul>
                    </div>
                    <div style={{display:'inline-block',margin:'10px'}}>
                      <h6>Domain</h6>
                      <ul>
                        <li>Resolve IP</li>
                        <li>Resolve MX</li>
                        <li>Resolve Nameservers</li>
                      </ul>
                    </div>
                    <div style={{display:'inline-block',margin:'10px'}}>
                      <h6>IP</h6>
                      <ul>
                        <li>Enrich ASN</li>
                        <li>Enrich GIP</li>
                        <li>Enrich WHOIS</li>
                        <li>Enrich Hostname</li>
                        <li>Return Ports</li>
                        <li>Return Netblock</li>
                      </ul>
                    </div>
                  </div>
                  }
                  {macroDetails == "macro2" &&
                  <div style={{position: "fixed", minHeight:"25%", width: '40%',top:'56px', left: "334px",padding: '10px',backgroundColor:"white",opacity:'0.9',borderRadius:'15px',border:'solid',borderColor:'#0277bd'}}>
                    <div onClick={() => setMacroDetails("none")}>
                      <FontAwesomeIcon size="2x" icon={faTimesCircle} style={{float:'right'}}/>
                    </div>
                    <FontAwesomeIcon size="2x" icon={faInfoCircle} style={{float:'left',color:'#0277bd'}}/>
                    <h4 style={{textAlign:'center'}}>Macro 2 Details</h4>
                    <hr></hr>
                    <h6 style={{textAlign:'center'}}>Macro 2 does not yet exist.</h6>
                  </div>
                  }
            </MenuBar>
            <MenuBar side="right" icon="edit">
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#e0e0e0',
                  display: 'grid',
                  gridTemplateRows: '150px 110px 70px auto',
                  justifyContent: 'center',
                  gridTemplateColumns: '80%'
                }}
              >
                <InsertForm config={props.config} />
              <Row></Row>
                
                <Button width="100%" onClickFunction={() => dispatchModal('New Event Form')}>
                  <div>New Event</div>
                </Button>
              </div>
            </MenuBar>
            <MenuBar side="bottom" icon="list">
              <div
                style={{
                  display: 'grid',
                  flexWrap: 'wrap',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#e0e0e0',
                  gridTemplateRows: '70px 70px auto',
                  gridTemplateColumns: '33.33% 33.33% 33.33%',
                  justifyContent: 'center'
                }}
              >
                <div style={{ gridColumn: '1 / span 3' }}>
                  <Button
                    width="100%"
                    hasIcon
                    onClickFunction={() => {
                      dispatchModal('Database Management');
                    }}
                  >
                    <FontAwesomeIcon size="lg" icon="server" />
                    Database Management
                  </Button>
                </div>
                <div style={{ gridColumn: 1 }}>
                  <Button width="40%" type="button" onClickFunction={() => dispatchModal('Neo4j Data')}>
                    Export JSON Data
                  </Button>
                </div>
                <div style={{ gridColumn: 2 }}>
                  <Button
                    type="button"
                    onClickFunction={() => {
                      axios.get('/api/v1/neo4j/wipe').then(() => {
                        axios.get('/api/v1/neo4j/export').then(({ data }) => {
                          setNeo4jData(data);
                        });
                      });
                    }}
                    width="40%"
                  >
                    Wipe DB
                  </Button>
                </div>
                <div style={{ gridColumn: 3 }}>
                  <ImportJson/>
                  
                </div>
              </div>
              
            </MenuBar>
          </AppContainer>
        </DataContext.Provider>
      </ModalContext.Provider>
    </MenuContext.Provider>
  );
};

export default App;
