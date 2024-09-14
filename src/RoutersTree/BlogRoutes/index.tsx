import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../MenuRoutes/MenuAdminRoutes";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogPage from "../../component/page/blog/BlogPage";
import ViewBlog from "../../component/page/blog/ViewBlog";
import MenuHeader from "../../common/layout/MenuHeader";
import MenuTab from "../../common/layout/TabLayout";
import BlogLayout from "../../common/layout/BlogLayout/BlogLayout";
import EditBlogPost from "../../component/page/blog/EditBlogPost";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
      {/*<BlogLayout>*/}
        <Routes>
          <Route path="/create" element={<CreateBlogPost />} />
          <Route path="/view/:id" element={<ViewBlog />} />
          <Route path="/edit/:id" element={<EditBlogPost />} />
          <Route path="/home" element={<BlogPage />} />
        </Routes>
      {/*</BlogLayout>*/}
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`
  height: 100%;
  width: 100%;
`;
