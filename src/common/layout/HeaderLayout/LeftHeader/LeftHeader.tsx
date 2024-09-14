import styled from "styled-components";
import useLeftHeader from "./useLeftHeader";
import {Link} from "react-router-dom"
import {useLocation, useNavigate} from "react-router-dom";

interface LeftHeaderProps {

}
function LeftHeader(props : LeftHeaderProps) {
  const {
    menus
  } = useLeftHeader();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <StyledLeftHeader isHome={!!(location.pathname === "/home")}>
      <Link
        className="title"
        to={`${process.env.PUBLIC_URL}/home`}
      >
        Koraveler
      </Link>
      <div className="menu">
        {menus.map(menu => {
          return (
            <Link className="menu-label" to={`${process.env.REACT_APP_URI}${menu.url}`}>
              {menu.label}
            </Link>
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