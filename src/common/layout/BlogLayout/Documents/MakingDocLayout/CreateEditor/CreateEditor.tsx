import styled from "styled-components";
import CusEditor from "../../../../../elements/CusEditor/CusEditor";
import {forwardRef} from "react";
import useCreateEditor from "./useCreateEditor";

export interface CreateDocumentProps {

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  const { onUploadImg } = useCreateEditor(props);
  return (
    <StyledCreateDocument>
      <CusEditor
        ref={ref}
        hooks={{
          addImageBlobHook: onUploadImg
        }}
      />
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`

`;
