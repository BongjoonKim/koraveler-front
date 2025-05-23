import styled from "styled-components";
import CusEditor from "../../../../../elements/CusEditor/CusEditor";
import {forwardRef} from "react";
import useCreateEditor from "./useCreateEditor";
import TinyEditor from "../../../../../elements/CusEditor/TinyEditor";

export interface CreateDocumentProps extends DocumentDTO{

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  const {
    onUploadImg,
    handleImageUpload,
    getEditorConfig,
  } = useCreateEditor(props);
  console.log("파일 전체 확인", props)
  return (
    <StyledCreateDocument>
      {/*<CusEditor*/}
      {/*  ref={ref}*/}
      {/*  hooks={{*/}
      {/*    addImageBlobHook: onUploadImg*/}
      {/*  }}*/}
      {/*/>*/}
      {props?.id && (
        <TinyEditor
          ref={ref}
          handleImageUpload={handleImageUpload}
          getEditorConfig={getEditorConfig}
        />
      )}
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`
  height: 100%;
  width: 100%;
`;
