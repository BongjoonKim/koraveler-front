import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";
import TravelMessengerPage from "../../component/page/messenger/TravelMessengerPage";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<TravelMessengerPage />} />
        </Routes>
      </AdminLayout>
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`
  height: 100%;
  width: 100%;
`;
