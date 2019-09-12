import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button/Button';
import {logout} from './UserFunctions';

const Landing = ({ isSignedIn, setSignedIn, isAdmin, setAdmin }) => {
  
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
        <hr/>
      </>
    )}
    {isSignedIn && (
      <>
        
        <a href="/tiweb/graph">
          <Button width="100%" onClickFunction={() => {}}>
            <div style={{ width: '100%', textAlign: 'center' }}>Ti-Graph</div>
          </Button>
        </a>
        <hr></hr>
          <Button  width="100%" onClickFunction={() => {
            setSignedIn(false);
            setAdmin(false);
            return logout();}
          }>
            <div style={{ width: '100%', textAlign: 'center' }}>
            Logout
            </div>
          </Button>
      </>
    )}
  </>
)};

export default Landing;
