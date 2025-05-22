import styled from "styled-components";
import FolderTreeView from "../../../../common/widget/FolderTree";

export interface TechHomeProps {

};

function TechHome(props: TechHomeProps) {
  
  return (
    <StyledTechHome>
        <FolderTreeView />
    </StyledTechHome>
  )
};

export default TechHome;

const StyledTechHome = styled.div`

`;
