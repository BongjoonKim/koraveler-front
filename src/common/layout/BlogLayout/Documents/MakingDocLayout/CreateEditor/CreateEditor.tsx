import styled from "styled-components";
import CusEditor from "../../../../../elements/CusEditor/CusEditor";
import {forwardRef} from "react";

export interface CreateDocumentProps {

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  return (
    <StyledCreateDocument>
      <CusEditor
        ref={ref}
      />
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`

`;
