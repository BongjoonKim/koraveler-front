import styled from "styled-components";
import useMenuLeftHeader from "./useMenuLeftHeader";

export interface LeftHeaderProps {

};

function MenuLeftHeader(props: LeftHeaderProps) {
  const {menuList} = useMenuLeftHeader(props);
  return (
    <StyledLeftHeader>
      <a className={"title"} href={`${process.env.REACT_APP_URI}/home`}>
        Koraveler
      </a>
      <div>
        {menuList.map(menu => {
          console.log("메뉴 정보", menu)
          return (
            <div>
              {menu.label}
            </div>
          )
        })}
      </div>
    </StyledLeftHeader>
  )
};

export default MenuLeftHeader;

const StyledLeftHeader = styled.div`
  .title {
    font-size: 2rem;
    font-weight: 600;
  }
`;
