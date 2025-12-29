import styled from "styled-components";
import {forwardRef} from "react";
import useCreateEditor from "./useCreateEditor";
import TiptapEditor from "../../../../../elements/CusEditor/TipTabEditor";

export interface CreateDocumentProps extends DocumentDTO{

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  const {
    handleImageUpload,
    handleContentChange,
  } = useCreateEditor(props);
  
  console.log("파일 전체 확인", props)
  
  return (
    <StyledCreateDocument>
      <TiptapEditor
        ref={ref}
        handleImageUpload={handleImageUpload}
        onChange={handleContentChange}
        placeholder="내용을 입력하세요..."
      />
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`
    flex:1;
    width: 100%;
    min-height: 0;  /* 추가 */
    height: 0;
    display: flex;  /* 추가 */
    flex-direction: column;  /* 추가 */
`;