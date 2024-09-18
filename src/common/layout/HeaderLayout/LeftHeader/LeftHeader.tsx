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
      position: relative;
      text-decoration: none;
      color: black;
      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px; /* bar의 높이 */
        left: 0;
        bottom: -2px; /* 텍스트 바로 아래에 위치 */
        background-color: #000; /* bar의 색깔 */
        transition: width 0.3s ease; /* 서서히 나타나는 애니메이션 */
      }
      &:hover::after {
        width: 100%; /* hover 시 bar의 너비를 100%로 설정 */
      }
    }
    
  }
`;