import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CreateBlogPost from "../../component/page/blog/CreateBlogPost/CreateBlogPost";
import NewBlogRedirect from "../../component/page/blog/CreateBlogPost/NewBlogRedirect";
import BlogPage from "../../component/page/blog/BlogPage";
import ViewBlog from "../../component/page/blog/ViewBlog";
import EditBlogPost from "../../component/page/blog/EditBlogPost";
import TranslationManage from "../../component/page/blog/TranslationManage";
import MyBlogDashboard from "../../component/page/blog/MyBlogDashboard";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import EmptyLayout from "../../common/layout/MainLayout/EmptyLayout";
import BlogLocaleRedirect from "./BlogLocaleRedirect";
import ProtectedRoute from "../ProtectedRoute";

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
            {/* 내 블로그 관리 대시보드 (로그인 필요) */}
            <Route path="/my" element={
              <ProtectedRoute>
                <MyBlogDashboard />
              </ProtectedRoute>
            } />
            {/* locale 포함 블로그 목록 라우트 */}
            <Route path="/home/:locale" element={<BlogPage />} />
            <Route path="/:type/:locale" element={<BlogPage />} />
            {/* locale 없는 URL → redirect */}
            <Route path="/home" element={<BlogLocaleRedirect type="home" />} />
            <Route path="/:type" element={<BlogLocaleRedirect />} />
          </Route>

          {/* 새 글 진입점 — 빈 draft 생성 후 /blog/create/{id} 로 교체 이동.
              비로그인 시 ProtectedRoute 가 /login 으로 보내고 로그인 후 이 경로로 자동 복귀. */}
          <Route element={<MainLayout showHero={false} />}>
            <Route path="/create-new" element={
              <ProtectedRoute>
                <NewBlogRedirect />
              </ProtectedRoute>
            } />
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
