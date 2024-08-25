import styled from "styled-components";
import useLeftHeader from "./useLeftHeader";
import {Link, LinkBox} from "@chakra-ui/react";

interface LeftHeaderProps {

}
function LeftHeader(props : LeftHeaderProps) {
  const {
    menus
  } = useLeftHeader();
  return (
    <StyledLeftHeader>
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

const StyledLeftHeader = styled.div`
  
  a {
    cursor: pointer;
  }
  width: 100%;
  z-index: 2000;
  display: flex;
  position: inherit;
  align-items: center;
  height: 3rem;
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