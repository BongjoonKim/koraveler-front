import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../MenuRoutes/MenuAdminRoutes";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogPage from "../../component/page/blog/BlogPage";
<<<<<<< HEAD
import ViewBlog from "../../component/page/blog/ViewBlog";
import MenuHeader from "../../common/layout/MenuHeader";
import MenuTab from "../../common/layout/TabLayout";
import BlogLayout from "../../common/layout/BlogLayout/BlogLayout";
=======
>>>>>>> parent of ada1899 (블로그 뷰어 화면 개발 중)

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <StyledBlogRoutes>
<<<<<<< HEAD
      <BlogLayout>
        <Routes>
          <Route path="/create" element={<CreateBlogPost />} />
          <Route path="/edit" element={<CreateBlogPost />} />
          <Route path="/view/:id" element={<ViewBlog />} />
          <Route path="/edit/:id" element={<CreateBlogPost />} />
          <Route path="/home" element={<BlogPage />} />
        </Routes>
      </BlogLayout>
=======
      <Routes>
        <Route path="/create" element={<CreateBlogPost />} />
        <Route path="/edit" element={<CreateBlogPost />} />
        <Route path="/view/:id" element={<CreateBlogPost />} />
        <Route path="/home" element={<BlogPage />} />
      </Routes>
>>>>>>> parent of ada1899 (블로그 뷰어 화면 개발 중)
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`

`;
