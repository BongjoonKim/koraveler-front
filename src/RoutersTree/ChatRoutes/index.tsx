import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import TravelMessengerPage from "../../component/page/messenger/TravelMessengerPage";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import ProtectedRoute from "../ProtectedRoute";

interface BlogRoutesProps {

};

function BlogRoutes(props: BlogRoutesProps) {
  
  return (
    <ProtectedRoute requiredRoles={["user", "admin"]}>
      <StyledBlogRoutes>
        <MainLayout showHero={false}>
          <Routes>
            <Route path="/" element={<TravelMessengerPage />} />
          </Routes>
        </MainLayout>
      </StyledBlogRoutes>
    </ProtectedRoute>
  )
};

export default BlogRoutes;

const StyledBlogRoutes = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
