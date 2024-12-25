import styled from "styled-components";
import CusWeather from "../../../../../common/widget/CusWeather";

export interface TravelHomeMainProps {

};

function TravelHomeMain(props: TravelHomeMainProps) {
  
  return (
    <StyledTravelHomeMain>
      <div className="wrapper-table-widget">
        
        <CusWeather />
      </div>
      
    </StyledTravelHomeMain>
  )
};

export default TravelHomeMain;

const StyledTravelHomeMain = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
  .wrapper-table-widget {
    display: flex;
  }
`;
