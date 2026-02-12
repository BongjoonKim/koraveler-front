import {Route, Routes} from "react-router-dom";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import styled from "styled-components";
import TravelHomeMain from "../../component/page/travel/TravelHome/TravelHomeMain";
import TravelCreateProject from "../../component/page/travel/TravelCreateProject";
import TravelDashboard from "../../component/page/travel/TravelDashboard";

export default function TravelRoutes() {
  return (
    <StyledTravelRoutes>
      <Routes>
        {/* MainLayout이 필요한 라우트들 */}
        <Route element={<MainLayout showHero={false} />}>
          <Route path="/home" element={<TravelHomeMain />} />
          <Route path="/create" element={<TravelCreateProject />} />
          <Route path="/dashboard/:travelId" element={<TravelDashboard />} />
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
