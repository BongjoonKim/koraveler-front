import styled from "styled-components";
import {Editor, Editor as ToastUi, EditorProps} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import {forwardRef, MutableRefObject} from "react";

interface CusEditorProps extends EditorProps{
  // ref : MutableRefObject<any>
};

function CusEditor(props: CusEditorProps, ref : any) {
  console.log("이니셜 밸류", props)
  return (
    <StyledCusEditor>
      <ToastUi
        initialValue={props.initialValue}
        initialEditType={props.initialEditType || "markdown"}
        plugins={[colorSyntax, codeSyntaxHighlight]}
        // hideModeSwitch={true}
        previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'}
        useCommandShortcut={true}
        ref={ref}
        language="ko-KR"
        hooks={props.hooks}
        height={"100%"}
      />
    </StyledCusEditor>
  )
};

export default forwardRef(CusEditor);

const StyledCusEditor = styled.div`
  width: 100%;
  height: 100%;
`;
