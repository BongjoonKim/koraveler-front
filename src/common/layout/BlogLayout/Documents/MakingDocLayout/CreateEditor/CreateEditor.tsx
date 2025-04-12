import styled from "styled-components";
import CusEditor from "../../../../../elements/CusEditor/CusEditor";
import {forwardRef} from "react";
import useCreateEditor from "./useCreateEditor";
import TinyEditor from "../../../../../elements/CusEditor/TinyEditor";

export interface CreateDocumentProps {

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  const {
    onUploadImg,
    handleImageUpload,
    getEditorConfig,
  } = useCreateEditor(props);
  return (
    <StyledCreateDocument>
      {/*<CusEditor*/}
      {/*  ref={ref}*/}
      {/*  hooks={{*/}
      {/*    addImageBlobHook: onUploadImg*/}
      {/*  }}*/}
      {/*/>*/}
      <TinyEditor
        ref={ref}
        handleImageUpload={handleImageUpload}
        getEditorConfig={getEditorConfig}
      />
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`
  height: 100%;
  width: 100%;
`;
