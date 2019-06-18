import React from 'react';

import Button from '../components/Button/Button';

import { Link} from 'react-router-dom';


const User_page = ({ isSignedIn }) => (
 
  <>
    <div classname="container">
      
    </div>
    <h1 className="text-center">Threat Intelligence Graph</h1>
    <p><center>NSF funded project at the University of Nevada, Reno</center></p>
    <p><center>User Page</center></p>
    {!isSignedIn && (
      <>
       {/*} <Button hasIcon width="100%" onClickFunction={() => {axios.post('/api/v1/session/init', {user : 'testUser'}).then(({data}) => {alert(data)})}}>
          <FontAwesomeIcon fixedWidth size="lg" icon="user" color="#e0e0e0" />
          <div style={{ width: '100%', textAlign: 'center' }}>Login</div>
    </Button>
    <br />
         <a href="/tiweb/graph">
          <Button hasIcon width="100%" onClickFunction={() => {}}>
            <FontAwesomeIcon fixedWidth size="lg" icon="user-plus" color="#e0e0e0" />
            <div style={{ width: '100%', textAlign: 'center' }}>Register</div>
          </Button>
    </a>*/}
      </>
    )}
    <>
    <center>
    <ul className="navbar-nav">
    <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/change_password">
            Change Password
          </Link>
    </li>
        
      </ul>
      </center>
   </>
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

export default User_page;
