import styled from "styled-components";
import {forwardRef, useState, useEffect} from "react";
import useCreateEditor from "./useCreateEditor";
import QuillEditor from "../../../../../elements/CusEditor/QuillEditor";
import ReactQuill from "react-quill";

export interface CreateDocumentProps extends DocumentDTO{

};

function CreateEditor(props: CreateDocumentProps, ref : any) {
  const {
    handleImageUpload,
    getEditorConfig,
  } = useCreateEditor(props);
  
  // 로컬 상태로 에디터 내용 관리
  const [editorContent, setEditorContent] = useState("");
  
  console.log("파일 전체 확인", props)
  
  // ref를 통해 내용 가져오기 메서드 추가
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.getContent = () => editorContent;
    }
  }, [editorContent, ref]);
  
  return (
    <StyledCreateDocument>
      <QuillEditor
        ref={ref}
        handleImageUpload={handleImageUpload}
        getEditorConfig={getEditorConfig}
        onChange={setEditorContent}
        initialValue=""
        // editorKey="create-editor" // 고유 key 추가
        placeholder="내용을 입력하세요..."
      />
      {/*<ReactQuill />*/}
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateEditor);

const StyledCreateDocument = styled.div`
    height: 100%;
    width: 100%;
    min-height: 400px; /* 최소 높이 보장 */
    position: relative;

    /* QuillEditor가 항상 보이도록 */
    > * {
        height: 100%;
        width: 100%;
    }
`;