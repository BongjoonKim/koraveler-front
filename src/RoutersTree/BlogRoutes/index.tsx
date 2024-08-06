import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../MenuRoutes/MenuAdminRoutes";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogPage from "../../component/page/blog/BlogPage";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
      <Routes>
        <Route path="/create" element={<CreateBlogPost />} />
        <Route path="/edit" element={<CreateBlogPost />} />
        <Route path="/view/:id" element={<CreateBlogPost />} />
        <Route path="/home" element={<BlogPage />} />
      </Routes>
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`

`;
