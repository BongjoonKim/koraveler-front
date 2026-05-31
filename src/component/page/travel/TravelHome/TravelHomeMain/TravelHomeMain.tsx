import styled from "styled-components";
import {Box, Container} from "@chakra-ui/react";
import TravelProjectHero from "../TravelProjectHero";
import TravelRecentProjects from "../TravelRecentProjects";
import TravelPluginStore from "../TravelPluginStore";

export interface TravelHomeMainProps {}

function TravelHomeMain(_props: TravelHomeMainProps) {
  return (
    <StyledShell>
      <Container maxW="7xl" px={{base: 4, md: 6, lg: 6}}>
        <TravelProjectHero />

        <Layout>
          <Main>
            <TravelRecentProjects />
            <TravelPluginStore />
          </Main>
        </Layout>
      </Container>
    </StyledShell>
  );
}

export default TravelHomeMain;

// BlogPage 와 동일한 다크 셸 — /blog/home 과 시각 통일.
const StyledShell = styled(Box)`
  min-height: calc(100vh - 3rem);
  padding: 1.5rem 0 3rem;
  color: white;
  background: #0a0c0c;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 0.5rem;
`;

const Main = styled.div`
  min-width: 0;
`;
