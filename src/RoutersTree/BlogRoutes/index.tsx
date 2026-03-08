import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import BlogPage from "../../component/page/blog/BlogPage";
import ViewBlog from "../../component/page/blog/ViewBlog";
import EditBlogPost from "../../component/page/blog/EditBlogPost";
import TranslationManage from "../../component/page/blog/TranslationManage";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import EmptyLayout from "../../common/layout/MainLayout/EmptyLayout";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  // BlogLayout은 Mainlayout을 변경 중
  return (
    <StyledBlogRoutes>
        <Routes>
          {/* MainLayout이 필요한 라우트들 */}
          <Route element={<MainLayout showHero={false} />}>
            <Route path="/view/:locale/:id" element={<ViewBlog />} />
            <Route path="/view/:id" element={<ViewBlog />} />
            <Route path="/translations/:id" element={<TranslationManage />} />
            <Route path="/home" element={<BlogPage />} />
            <Route path="/:type" element={<BlogPage />} />
          </Route>

          {/* MainLayout 없이 독립적으로 렌더링되는 라우트들 */}
          <Route element={<EmptyLayout/>}>
            <Route path="/create/:id" element={<CreateBlogPost />} />
            <Route path="/edit/:locale/:id" element={<EditBlogPost />} />
            <Route path="/edit/:id" element={<EditBlogPost />} />
          </Route>
        </Routes>
    </StyledBlogRoutes>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`
    flex: 1;
    width: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
`;
