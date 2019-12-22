import styled from 'styled-components';

// Theme colors
const primaryBlue = '#0277bd';
const primaryDarkBlue = '#004c8c';
const primaryLightBlue = '#58a5f0';
const secondaryGrey = '#e0e0e0';

const AppContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 36px minmax(100px, 300px) auto minmax(100px, 300px) 36px;
  grid-template-rows: 56px 200px auto 200px 36px;
  background-color: #ffffff;
`;

const SplashScreenBody = styled.div`
  display: grid;
  grid-template-rows: minmax(200px, 50vh) minmax(200px, 50vh);
  align-items: center;
  background-color: ${primaryBlue};
  color: ${secondaryGrey};
  line-height: 1.4;
  text-align: center;
  justify-items: center;
  cursor: wait;
`;

const NavBarStyle = styled.nav`
  z-index: 6;
  width: 100%;
  background-color: ${primaryBlue};
  height: 56px;
  grid-column: 1 / span 5;
  grid-row: 1;
  display: flex;
  align-items: center;
  position: fixed;
  color: ${secondaryGrey};
`;

const UnstyledButton = styled.button`
  display: inline-block;
  border: none;
  margin: 0;
  background: ${props => props.color || 'none'};
  text-align: center;
`;

const MenuBarStyle = styled(UnstyledButton)`
  background-color: ${primaryLightBlue};
  z-index: 6;
  ${props => {
    if (props.side === 'left') {
      return `
        box-shadow: 0px 1px 4px 1px #11111144;
        height: 128px;
        width: 36px;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        align-self: center;
        grid-row: 2 / span 3;
        grid-column: 1;
        `;
    }
    if (props.side === 'right') {
      return `
        box-shadow: 0px 1px 4px 1px #11111144;
        height: 128px;
        width: 36px;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        grid-column: 5;
        align-self: center;
        grid-row: 2 / span 3;
        `;
    }
    if (props.side === 'bottom') {
      return `
        box-shadow: 1px 0px 4px 1px #11111144;
        height: 36px;
        width: 128px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        grid-column: 2 / span 3;
        grid-row: 5;
        justify-self: center;
      `;
    }
    return ``;
  }};
  :hover {
    background-color: #5897f0;
  }
`;

const ExpandedMenuBar = styled.div`
  background-color: #171717;
  border: 3px solid ${primaryBlue};
  z-index: 6;
  ${props => {
    if (props.side === 'left') {
      return `
        grid-template-columns: auto 50px;
        display: grid;
        grid-column: 1 /span 2;
        grid-row: 2 /span 3;
        height: 100%;
        width: 100%;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        align-self: center;
        align-items: center;
        justify-items: end;
        `;
    }
    if (props.side === 'right') {
      return `
        grid-template-columns: 50px auto;
        display: grid;
        height: 100%;
        width: 100%;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        grid-column: 4 / span 2;
        grid-row: 2 / span 3;
        align-self: center;
        justify-self: end;
        align-items: center;
        `;
    }
    if (props.side === 'bottom') {
      return `
        grid-template-rows: 50px auto;
        justify-items: center;
        display: grid;
        height: 100%;
        width: 100%;
        max-width: 700px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        grid-column: 2 / span 3;
        grid-row: 4 / span 2;
        justify-self: center;
        align-self: end;
      `;
    }
    return ``;
  }};
`;

const MenuBarChildStyle = styled.div`
  grid-column: ${({ side }) => (side === 'right' ? 2 : 1)};
  grid-row: ${({ side }) => (side === 'bottom' ? 2 : 1)};
  width: 100%;
  height: 100%;
`;

const MenuBarIconStyle = styled.div`
  grid-column: ${({ side }) => {
    if (side === 'right' || side === 'bottom') {
      return 1;
    }
    return 2;
  }};
  grid-row: 1;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-content: center;
`;

const ContentContainerStyle = styled.div`
  display: grid;
  grid-row: 1 / span 5;
  grid-column: 1 / span 5;
`;

const ModalContentStyle = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 36px auto;
  grid-template-columns: auto 36px;
`;

const StyledButtonChild = styled.div`
  ${props => (props.hasIcon && props.index === 0 ? 'flex-grow: 0' : 'flex-grow: 2')}
`;

const GraphMenuInputStyle = styled.input`
  height: 36px;
  width: 100%;
  border-radius: 4px;
  text-align: center;
  background-color: #ffffff;
  color: #111111;
`;

export {
  AppContainer,
  SplashScreenBody,
  NavBarStyle,
  UnstyledButton,
  MenuBarStyle,
  ExpandedMenuBar,
  MenuBarChildStyle,
  MenuBarIconStyle,
  ContentContainerStyle,
  ModalContentStyle,
  StyledButtonChild,
  GraphMenuInputStyle
};
