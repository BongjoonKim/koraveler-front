import styled from "styled-components";
import MenuLeftHeader from "./MenuLeftHeader";
import MenuRightHeader from "./MenuRightHeader/MenuRightHeader";

interface MainHeaderProps {

}

/* 메인 화면의 헤더에 사용되는 컴포넌트입니다 */
function MenuHeader(props : MainHeaderProps) {
  return (
    <StyledMainHeader>
      <MenuLeftHeader />
      <MenuRightHeader />
    </StyledMainHeader>
  )
}

export default MenuHeader;

const StyledMainHeader = styled.div`
  width: 100vw;
  height: 10vh;
`;