import React, { useContext } from 'react';

import { NavBarStyle } from '../__styles__/styles';
import MenuContext from '../App/MenuContext';
import NewDropdown from './Dropdown';



const NavBar = (props) => {
  const { isExpanded, dispatchExpand } = useContext(MenuContext);
  
  
  return (
    <>
      <NavBarStyle>
        <div style={{marginLeft: "1%"}}> 
          <NewDropdown permissions={props.permissions} dispatchExpand={dispatchExpand} isSignedIn={props.isSignedIn}/>
        </div>
        
        <a style={{ flexGrow: 2, textAlign: 'center', color: '#e3e3e3' }} href="/ti-graph">
          <div>ti-graph</div>
        </a>
        {/*<UnstyledButton onClick={() => {}}>
          <a style={{ flexGrow: 2, textAlign: 'center', color: '#e3e3e3' }} href="/login">
            <FontAwesomeIcon size="lg" icon="user" color="#e0e0e0" />
          </a>
      </UnstyledButton>*/}
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
        
        </div>
      )}
    </>
  );
};

export default NavBar;