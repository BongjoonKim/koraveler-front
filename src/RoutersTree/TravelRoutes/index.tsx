import styled from "styled-components";
import TravelLayout from "../../common/layout/TravelLayout";
import {Route, Routes} from "react-router-dom";
import TravelHome from "../../component/page/travel/TravelHome";

export interface TravelRoutesProps {

};

function TravelRoutes(props: TravelRoutesProps) {
  
  return (
    <StyledTravelRoutes>
      <TravelLayout>
        <Routes>
          <Route path="/home" element={<TravelHome />} />
        </Routes>
      </TravelLayout>
    </StyledTravelRoutes>
  )
};

export default TravelRoutes;

const StyledTravelRoutes = styled.div`
  width: 100%;
  height: 100%;
`;
