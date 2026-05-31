import MainLayout from "../../../common/layout/MainLayout/MainLayout";
import MainBody from "./MainBody";

export interface MainPageProps {}

function MainPage(_props: MainPageProps) {
  return (
    <MainLayout showHero={false}>
      <MainBody />
    </MainLayout>
  );
}

export default MainPage;
