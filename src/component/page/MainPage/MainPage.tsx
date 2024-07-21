import styled from "styled-components";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";
import MainBody from "./MainBody";

export interface MainPageProps {

}

function MainPage(props : MainPageProps) {
  return (
    <StyledMainPage>
      <MainBody />
      <div className="header">
        <LeftHeader />
        <RightHeader />
      </div>
    </StyledMainPage>
  )
}

export default MainPage;

const StyledMainPage = styled.div`
  user-select: none;
  .header {
    width: 100%;
    height: 2rem;
    position: absolute;
    padding : 2rem;
    display: flex;
    justify-content: space-between;
  }
`;
