import styled from "styled-components";
import {Viewer} from "@toast-ui/react-editor";

export interface ViewerDocProps {
  contents ?: string | undefined;
};

function ViewerDoc(props: ViewerDocProps) {
  
  return (
    <StyledViewerDoc>
        {props.contents
          ? (
            <Viewer
              initialValue={props.contents}
            />
          ) : (
            <></>
          )
        }
    </StyledViewerDoc>
  )
};

export default ViewerDoc;

const StyledViewerDoc = styled.div`

`;
