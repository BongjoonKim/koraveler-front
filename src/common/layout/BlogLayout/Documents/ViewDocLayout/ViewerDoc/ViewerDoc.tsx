import styled from "styled-components";
import {forwardRef} from "react";
import {Viewer} from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';


interface ViewEditorProps {
  contents ?: string | undefined;
};

function ViewerDoc(props: ViewEditorProps, ref : any) {
  console.log("컨텐츠 확인", props.contents)
  return (
    <>
      {props.contents
        ? (
          <Viewer
            ref={ref}
            initialValue={props.contents}
          />
        ) : (
      <></>
        )
      }
    </>


  )
};

export default forwardRef(ViewerDoc);

const StyledViewEditor = styled(Viewer)`

`;
