import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button/Button';
import {logout} from './UserFunctions';

const Landing = ({ isSignedIn, setSignedIn }) => {
  
  return (
  <>
    <h1 className="text-center">Threat Intelligence Graph</h1>
    <center><p>NSF funded project at the University of Nevada, Reno</p></center>
    {!isSignedIn && (
      <>
        <a href="/tiweb/login">
          <Button hasIcon width="100%" onClickFunction={() => {}}>
            <FontAwesomeIcon fixedWidth size="lg" icon="user" color="#e0e0e0" />
            <div style={{ width: '100%', textAlign: 'center' }}>Login</div>
          </Button>
        </a>
        <br />
        <a href="/tiweb/graph">
          <Button hasIcon width="100%" onClickFunction={() => {}}>
            <FontAwesomeIcon fixedWidth size="lg" icon="user-plus" color="#e0e0e0" />
            <div style={{ width: '100%', textAlign: 'center' }}>Ti-Graph</div>
          </Button>
        </a>
      </>
    )}
    {isSignedIn && (
      <>
        
        <a href="/tiweb/graph">
          <Button width="100%" onClickFunction={() => {}}>
            <div style={{ width: '100%', textAlign: 'center' }}>Graph</div>
          </Button>
        </a>
          <button onClick={() => {
            setSignedIn(false);
            return logout();}
          }>
              Logout
          </button>
      </>
    )}
  </>
)};

export default Landing;
