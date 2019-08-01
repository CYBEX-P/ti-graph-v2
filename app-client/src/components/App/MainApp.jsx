import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  // function handleEnrichAll() {
  //   setLoading(true);
  //   axios
  //     .get('/api/v1/enrich/all')
  //     .then(() => {
  //       axios
  //         .get('/api/v1/neo4j/export')
  //         .then(({ data }) => {
  //           setNeo4jData(data);
  //           setLoading(false);
  //         })
  //         .catch(() => {
  //           dispatchModal('Error');
  //           setLoading(false);
  //         });
  //     })
  //     .catch(() => {
  //       dispatchModal('Error');
  //       setLoading(false);
  //     });
  // }

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
              <h3 style={{paddingLeft: "20%", paddingRight: "25%", marginLeft: "20%", marginTop: "5%"}}>Macros</h3>
              <hr style={{marginLeft: "12.5%"}}/>
              <button
                id="macro1Button"
                style={{paddingLeft: "25%", paddingRight: "25%", marginLeft: "20%", marginTop: "5%"}}
                type="button"
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
                  }}
                >
                Macro 1
              </button>
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
                  gridTemplateColumns: '50% 50%',
                  justifyContent: 'center'
                }}
              >
                <div style={{ gridColumn: '1 / span 2' }}>
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
              </div>
            </MenuBar>
          </AppContainer>
        </DataContext.Provider>
      </ModalContext.Provider>
    </MenuContext.Provider>
  );
};

export default App;
