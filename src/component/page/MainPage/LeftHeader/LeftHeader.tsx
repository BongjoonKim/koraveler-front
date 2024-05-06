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
      <div className="icons">
      
      </div>
    </StyledLeftHeader>
  )
}

export default LeftHeader;

const StyledLeftHeader = styled.div`
  .title {
    font-size: 3rem;
    font-weight: 600;
  }
`;