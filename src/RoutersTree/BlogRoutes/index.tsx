import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../MenuRoutes/MenuAdminRoutes";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogList from "../../component/page/blog/BlogPage/BlogList";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
      <Routes>
        <Route path="/create" element={<CreateBlogPost />} />
        <Route path="/edit" element={<CreateBlogPost />} />
        <Route path="/view/:id" element={<CreateBlogPost />} />
        <Route path="/home" element={<BlogList />} />
      </Routes>
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`

`;
