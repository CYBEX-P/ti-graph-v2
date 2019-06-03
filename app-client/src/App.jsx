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

const App = ({ config }) => {
  const [isExpanded, dispatchExpand] = useReducer((_, action) => {
    if (action === 'left' || action === 'right' || action === 'bottom' || action === 'top') {
      return action;
    }
    return 'none';
  }, 'none');
  const [isSignedIn, setSignedIn] = useState(() => {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  });

  // For now, set a local storage token to anything to see logged in behavior
  // useEffect(() => localStorage.setItem('token', 'hi'));

  useEffect(() => {
    // TODO: Change this to be whatever we decide to save the token as
    if (localStorage.getItem('token')) {
      // TODO: Change to actual authentication istead of just being if the token exists
      return setSignedIn(true);
    }
    return setSignedIn(false);
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
          <Route path="/home" component={() => <Landing isSignedIn={isSignedIn} />} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/remove" component={Remove} />
          <Route path="/update" component={Update} />
          <Route path="/find" component={Find} />
          <Route path="/found" component={Found} />
        </div>
      </div>
    </Router>
  );
};

export default App;
