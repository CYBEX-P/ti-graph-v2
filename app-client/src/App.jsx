import React, { useState, useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import MainApp from './components/App/MainApp';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Find from './pages/Find';
import Found from './pages/Found';
import Remove from './pages/Remove';
import Update from './pages/Update';
import Landing from './pages/Landing';
import NavBar from './components/navBar/navBar';
import MenuContext from './components/App/MenuContext';
import Change_password from './pages/Change_Password';
import Axios from 'axios';

const App = ({ config }) => {
  const [isExpanded, dispatchExpand] = useReducer((_, action) => {
    if (action === 'left' || action === 'right' || action === 'bottom' || action === 'top') {
      return action;
    }
    return 'none';
  }, 'none');

  const [isSignedIn, setSignedIn] = useState(() => {
    Axios.get('/isSignedIn').then(({data}) => {
      if(data.value === 0){
        return false
      }
      else {
        return true
      }
    })
  });

  // For now, set a local storage token to anything to see logged in behavior
  // useEffect(() => localStorage.setItem('token', 'hi'));

  useEffect(() => {
    Axios.get('/isSignedIn').then(({data}) => {
      if(data.value === 0){
        return setSignedIn(false)
      }
      else {
        return setSignedIn(true)
      }
    })
  }, []);
  return (
    <Router basename='/tiweb'>
      <div style={{ minHeight: '100vh', backgroundColor: '#efefef' }} className="App">

        <Route path="/graph" component={() => <MainApp config={config} />} />
        <MenuContext.Provider value={{ dispatchExpand, isExpanded }}>
          <NavBar />
        </MenuContext.Provider>

        <div style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '32px' }} className="container">
          <Route exact path="/" component={() => <Redirect to="/home" />} />
          {/* {alert(isSignedIn)} */}
          <Route path="/home" component={() => <Landing isSignedIn={isSignedIn} setSignedIn={setSignedIn} />} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={() => <Login isSignedIn={isSignedIn} setSignedIn={setSignedIn} />} />
          <Route path="/profile" component={Profile} />
          <Route path="/remove" component={Remove} />
          <Route path="/update" component={Update} />
          <Route path="/find" component={Find} />
          <Route path="/found" component={Found} />
          <Route path="/Change_Password" component={Change_password} />
        </div>
      </div>
    </Router>
  );
};

export default App;
