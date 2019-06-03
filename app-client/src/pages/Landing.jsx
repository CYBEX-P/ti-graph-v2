import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button/Button';
import axios from 'axios';

const Landing = ({ isSignedIn }) => (
  <>
    <h1 className="text-center">Threat Intelligence Graph</h1>
    <p>NSF funded project at the University of Nevada, Reno</p>
    {!isSignedIn && (
      <>
        <Button hasIcon width="100%" onClickFunction={() => {axios.post('/api/v1/session/init', {user : 'testUser'}).then(({data}) => {alert(data)})}}>
          <FontAwesomeIcon fixedWidth size="lg" icon="user" color="#e0e0e0" />
          <div style={{ width: '100%', textAlign: 'center' }}>Login</div>
        </Button>
        <br />
        <a href="/tiweb/graph">
          <Button hasIcon width="100%" onClickFunction={() => {}}>
            <FontAwesomeIcon fixedWidth size="lg" icon="user-plus" color="#e0e0e0" />
            <div style={{ width: '100%', textAlign: 'center' }}>Register</div>
          </Button>
        </a>
      </>
    )}
    {isSignedIn && (
      <>
        <a href="/logout">Logout</a>
        <a href="/ti-graph">
          <Button width="100%" onClickFunction={() => {}}>
            <div style={{ width: '100%', textAlign: 'center' }}>Graph</div>
          </Button>
        </a>
      </>
    )}
  </>
);

export default Landing;
