import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../AdminRoutes/MenuAdminRoutes";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogPage from "../../component/page/blog/BlogPage";
import ViewBlog from "../../component/page/blog/ViewBlog";
import MenuHeader from "../../common/layout/MenuHeader";
import MenuTab from "../../common/layout/TabLayout";
import BlogLayout from "../../common/layout/BlogLayout/BlogLayout";
import EditBlogPost from "../../component/page/blog/EditBlogPost";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";
import TechHome from "../../component/page/tech/TechHome";

interface TechRoutesProps {

};

function TechRoutes(props: TechRoutesProps) {
  
  return (
    <StyledTechRoutes>
      <AdminLayout>
        <Routes>
          <Route path="/home" element={<TechHome />} />
        </Routes>
      </AdminLayout>
    </StyledTechRoutes>
  )
};

export default TechRoutes;

const StyledTechRoutes = styled.div`
  height: 100%;
  width: 100%;
`;
