import styled from "styled-components";
import {Viewer} from "@toast-ui/react-editor";

export interface ViewerDocProps {
  contents ?: string | undefined;
};

function ViewerDoc(props: ViewerDocProps, ref : any) {
  
  return (
    <StyledViewerDoc>
        {props.contents
          ? (
            <Viewer
              ref={ref}
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
