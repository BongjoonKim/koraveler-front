import {Route, Routes} from "react-router-dom";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import styled from "styled-components";
import TravelHomeMain from "../../component/page/travel/TravelHome/TravelHomeMain";
import TravelCreateProject from "../../component/page/travel/TravelCreateProject";
import TravelDashboard from "../../component/page/travel/TravelDashboard";
import TravelChat from "../../component/page/travel/TravelChat";
import ProtectedRoute from "../ProtectedRoute";

export default function TravelRoutes() {
  return (
    <StyledTravelRoutes>
      <Routes>
        {/* MainLayout이 필요한 라우트들 */}
        <Route element={<MainLayout showHero={false} />}>
          {/* 비로그인 허용 */}
          <Route path="/home" element={<TravelHomeMain />} />

          {/* 로그인 필요 */}
          <Route path="/create" element={
            <ProtectedRoute>
              <TravelCreateProject />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/:travelId" element={
            <ProtectedRoute>
              <TravelDashboard />
            </ProtectedRoute>
          } />
          <Route path="/chat/:travelId" element={
            <ProtectedRoute>
              <TravelChat />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </StyledTravelRoutes>
  )
}

const StyledTravelRoutes = styled.div`
    flex: 1;
    width: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
`;
