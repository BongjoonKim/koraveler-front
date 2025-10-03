import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";
import TravelMessengerPage from "../../component/page/messenger/TravelMessengerPage";
import BlogLayout from "../../common/layout/BlogLayout";
import MainLayout from "../../common/layout/MainLayout/MainLayout";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
      {/*<BlogLayout>*/}
      <MainLayout showHero={false}>
        <Routes>
          <Route path="/" element={<TravelMessengerPage />} />
        </Routes>
      </MainLayout>
      {/*</BlogLayout>*/}
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`
  height: 100%;
  width: 100%;
`;
