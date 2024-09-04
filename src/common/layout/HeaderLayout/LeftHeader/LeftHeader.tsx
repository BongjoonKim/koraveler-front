import styled from "styled-components";
import useLeftHeader from "./useLeftHeader";
import {Link, LinkBox} from "@chakra-ui/react";
import {useLocation} from "react-router-dom";

interface LeftHeaderProps {

}
function LeftHeader(props : LeftHeaderProps) {
  const {
    menus
  } = useLeftHeader();
  const location = useLocation();
  console.log("menus", menus)
  return (
    <StyledLeftHeader isHome={!!(location.pathname === "/home")}>
      <a className="title" href={`${process.env.PUBLIC_URL}/home`}>
        Koraveler
      </a>
      <div className="menu">
        {menus.map(menu => {
          return (
            <a className="menu-label" href={`${process.env.REACT_APP_URI}${menu.url}`}>
              {menu.label}
            </a>
          )
        })}
      </div>
    </StyledLeftHeader>
  )
}

export default LeftHeader;

const StyledLeftHeader = styled.div<any>`
  
  a {
    cursor: pointer;
  }
  z-index: 2000;
  display: flex;
  position: relative;
  align-items: center;
  height: 3rem;
  color: ${props => props.isHome === true ? "black" : "black"};
  .title {
    font-size: 3rem;
    font-weight: 600;
  }
  .menu {
    display: flex;
    gap: 2rem;
    margin: 0rem 3rem;
    .menu-label {
      font-size: 20px;
      font-weight: 500;
    }
    
  }
`;