import styled from "styled-components";
import useLeftHeader from "./useLeftHeader";

interface LeftHeaderProps {

}
function LeftHeader(props : LeftHeaderProps) {
  const {
    menus
  } = useLeftHeader();
  console.log("메뉴 확인", menus);
  return (
    <StyledLeftHeader>
      <div className="title">
        Koraveler
      </div>
      <div className="menu">
        {menus.map(menu => {
          console.log("메뉴 정보", menu)
          return (
            <a className="menu-label">
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
  width: 100%;
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