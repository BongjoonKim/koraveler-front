import styled from "styled-components";
import CusWeather from "../../../../../common/widget/CusWeather";
import TravelProjectHero from "../TravelProjectHero";
import TravelRecentProjects from "../TravelRecentProjects";
import TravelPluginStore from "../TravelPluginStore";
import {Container} from "@chakra-ui/react";

export interface TravelHomeMainProps {

};

function TravelHomeMain(props: TravelHomeMainProps) {

  return (
    <Container
      maxW="7xl"
      px={{ base: 4, sm: 6, lg: 8 }}
      py={{ base: 4, sm: 6, lg: 8 }}
      h={"100%"}
      flex={"1"}
      flexDirection={"column"}
      display={"flex"}
    >      <div className="wrapper-travel-projects">
        <TravelProjectHero />
        <TravelRecentProjects />
        <TravelPluginStore />
      </div>
    </Container>
  )
};

export default TravelHomeMain;

const StyledTravelHomeMain = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
  font-family: 'Noto Sans KR', sans-serif;

  .wrapper-table-widget {
    display: flex;
  }

  //.wrapper-travel-projects {
  //  margin-top: 24px;
  //  max-width: 960px;
  //}
`;
