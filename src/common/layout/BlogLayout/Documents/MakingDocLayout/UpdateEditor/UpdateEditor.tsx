import styled from "styled-components";
import {forwardRef, lazy, Suspense, useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import useUpdateEditor from "./useUpdateEditor";
// import CusEditor from "../../../../../elements/CusEditor/CusEditor";

export interface UpdateEditorProps extends DocumentDTO{

};

const CusEditor = lazy(() => import("../../../../../../common/elements/CusEditor"));


function UpdateEditor(props: UpdateEditorProps, ref : any) {
  const {
    onUploadImg
  } = useUpdateEditor(props);
  
  return (
    <Suspense>
      <StyledUpdateEditor>
        {props.contents !== undefined && (
          <CusEditor
            ref={ref}
            hooks={{
              addImageBlobHook : onUploadImg
            }}
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
