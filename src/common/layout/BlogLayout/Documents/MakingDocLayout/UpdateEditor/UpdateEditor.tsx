import styled from "styled-components";
import {forwardRef, lazy, Suspense, useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import useUpdateEditor from "./useUpdateEditor";
import TinyEditor from "../../../../../elements/CusEditor/TinyEditor";
import QuillEditor from "../../../../../elements/CusEditor/QuillEditor";
// import CusEditor from "../../../../../elements/CusEditor/CusEditor";

export interface UpdateEditorProps extends DocumentDTO{

};

const CusEditor = lazy(() => import("../../../../../../common/elements/CusEditor"));


function UpdateEditor(props: UpdateEditorProps, ref : any) {
  const {
    handleImageUpload,
    getEditorConfig
  } = useUpdateEditor(props);
  
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <StyledUpdateEditor>
        {(props.contents !== undefined) && (
          <QuillEditor
            ref={ref}
            handleImageUpload={handleImageUpload}
            getEditorConfig={getEditorConfig}
            initialValue={props.contents}
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
