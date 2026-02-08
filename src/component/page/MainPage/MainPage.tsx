import styled from "styled-components";
import MainLayout from "../../../common/layout/MainLayout/MainLayout";
import HomePage from "../homePage/HomePage";

export interface MainPageProps {

}

function MainPage(props : MainPageProps) {
  return (
    // <StyledMainPage>
    //   <HeaderLayout />
    //   <MainBody />
    // </StyledMainPage>
    <MainLayout showHero={true}>
      <HomePage />
    </MainLayout>
  )
}

export default MainPage;

const StyledMainPage = styled.div`
  user-select: none;
  height: 100%;
`;
