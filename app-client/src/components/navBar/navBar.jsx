import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { NavBarStyle, UnstyledButton } from '../__styles__/styles';
import MenuContext from '../App/MenuContext';

const NavBar = (props) => {
  const { isExpanded, dispatchExpand } = useContext(MenuContext);
  

  return (
    <>
      <NavBarStyle>
        <UnstyledButton
          onClick={() => {
            dispatchExpand(isExpanded === 'top' ? 'none' : 'top');
          }}
        >
          <FontAwesomeIcon size="lg" icon="bars" color="#e0e0e0" />
        </UnstyledButton>
        <a style={{ flexGrow: 2, textAlign: 'center', color: '#e3e3e3' }} href="/ti-graph">
          <div>ti-graph</div>
        </a>
        <UnstyledButton onClick={() => {}}>
          <a style={{ flexGrow: 2, textAlign: 'center', color: '#e3e3e3' }} href="/login">
            <FontAwesomeIcon size="lg" icon="user" color="#e0e0e0" />
          </a>
        </UnstyledButton>
      </NavBarStyle>
      {isExpanded === 'top' && (
        <div
          style={{
            backgroundColor: '#0277bd',
            boxShadow: '0px 2px 4px #22222233',
            position: 'absolute',
            width: '100%',
            top: '56px',
            zIndex: 7
          }}
        >
          <ul style={{ marginLeft: '12px' }} className="navbar-nav">
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/">
                <FontAwesomeIcon fixedWidth size="lg" icon="home" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/login">
                <FontAwesomeIcon fixedWidth size="lg" icon="user" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Login</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/register">
                <FontAwesomeIcon fixedWidth size="lg" icon="user-plus" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Register</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/find">
                <FontAwesomeIcon fixedWidth size="lg" icon="search" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Find User</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/remove">
                <FontAwesomeIcon fixedWidth size="lg" icon="user-slash" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Delete</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link onClick={() => dispatchExpand('none')} className="nav-link text-light" to="/update">
                <FontAwesomeIcon fixedWidth size="lg" icon="pen" color="#e0e0e0" />
                <span style={{ paddingLeft: '12px' }}>Update</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default NavBar;
