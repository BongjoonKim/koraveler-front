import styled from "styled-components";
import useLeftHeader from "./useLeftHeader";
import {Link} from "react-router-dom"
import {useLocation, useNavigate} from "react-router-dom";
import posthog from 'posthog-js'; // PostHog import 추가

interface LeftHeaderProps {

}

function LeftHeader(props : LeftHeaderProps) {
  const {
    menus,
    handleMenuHover,
  } = useLeftHeader();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 로고 클릭 추적 함수
  const handleLogoClick = () => {
    posthog.capture('logo_clicked', {
      current_page: location.pathname,
      timestamp: new Date().toISOString()
    });
  };
  
  // 메뉴 클릭 추적 함수
  const handleMenuClick = (menu: any) => {
    posthog.capture('menu_clicked', {
      menu_label: menu.label,
      menu_url: menu.url,
      current_page: location.pathname,
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <StyledLeftHeader isHome={!!(location.pathname === "/home")}>
      <Link
        className="title"
        to={`${process.env.PUBLIC_URL}/home`}
        onClick={handleLogoClick} // 로고 클릭 이벤트 추가
        onMouseEnter={() => handleMenuHover("home")} // 여기에 추가!
      >
        Koraveler
      </Link>
      <div className="menu">
        {menus.map((menu, index) => {
          return (
            <Link
              key={index} // key 추가 (React best practice)
              className="menu-label"
              to={`${process.env.REACT_APP_URI}${menu.url}`}
              onClick={() => handleMenuClick(menu)} // 메뉴 클릭 이벤트 추가
              onMouseEnter={() => handleMenuHover(menu.label!)} // 여기에 추가!
            >
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
                height: 2px;
                left: 0;
                bottom: -2px;
                background-color: #000;
                transition: width 0.3s ease;
            }
            &:hover::after {
                width: 100%;
            }
        }
    }
`;