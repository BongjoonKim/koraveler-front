import styled from "styled-components";
import {forwardRef, Suspense} from "react";
import useUpdateEditor from "./useUpdateEditor";
import TiptapEditor from "../../../../../elements/CusEditor/TipTabEditor";

export interface UpdateEditorProps extends DocumentDTO{

};

function UpdateEditor(props: UpdateEditorProps, ref : any) {
  const {
    handleImageUpload,
    handleContentChange,
  } = useUpdateEditor(props);
  
  return (
    <Suspense>
      <StyledUpdateEditor>
        {(props.contents !== undefined) && (
          <TiptapEditor
            ref={ref}
            handleImageUpload={handleImageUpload}
            onChange={handleContentChange}
            initialValue={props.contents}
            placeholder="내용을 입력하세요..."
          />
        )}
      </StyledUpdateEditor>
    </Suspense>
  )
};

export default forwardRef(UpdateEditor);

const StyledUpdateEditor = styled.div`
    height: 100%;
    width: 100%;
`;