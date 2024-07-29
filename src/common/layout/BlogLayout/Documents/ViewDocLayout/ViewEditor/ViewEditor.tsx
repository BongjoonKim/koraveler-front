import styled from "styled-components";
import {forwardRef} from "react";
import {Viewer} from "@toast-ui/react-editor";

interface ViewEditorProps {
  contents ?: string | undefined;
};

function ViewEditor(props: ViewEditorProps, ref : any) {
  
  return (
    <StyledViewEditor>
      <Viewer
        ref={ref}
        initialValue={props.contents}
      />
    </StyledViewEditor>
  )
};

export default forwardRef(ViewEditor);

const StyledViewEditor = styled.div`

`;
