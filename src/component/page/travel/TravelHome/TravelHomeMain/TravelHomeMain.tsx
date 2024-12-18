import styled from "styled-components";
import CusWeather from "../../../../../common/elements/CusWeather";

export interface TravelHomeMainProps {

};

function TravelHomeMain(props: TravelHomeMainProps) {
  
  return (
    <StyledTravelHomeMain>
      <CusWeather />
    </StyledTravelHomeMain>
  )
};

export default TravelHomeMain;

const StyledTravelHomeMain = styled.div`
  width: 100%;
  height: 100%;
`;
