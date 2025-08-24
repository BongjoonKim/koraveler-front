// src/common/elements/CusEditor/TinyEditor.tsx

import {forwardRef, useRef, useState} from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import {EditorProps} from "@toast-ui/react-editor";
import {CusEditorProps} from "./CusEditor";
import styled from "styled-components";

function TinyEditor(props : CusEditorProps, ref : any) {
  const [content, setContent] = useState<string | undefined>(props.initialValue);
  const editorConfig = {
    height: "100%",
    menubar: true,
    plugins: [
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'searchreplace',
      'fullscreen',
      'media',
      'table',
      'code',
      'help',
      'emoticons',
      'codesample',
      'quickbars',
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'lists table link charmap searchreplace | ' +
      'image media codesample emoticons fullscreen preview | ' +
      'removeformat | help ',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    ...props.getEditorConfig
  }
  
  console.log("tinyAlert", process.env["REACT_APP_TINY_API_KEY"])
  return (
    <StyledTinyEditor>
      <Editor
        onInit={(evt, editor) => ref.current = editor}
        apiKey={process.env["REACT_APP_TINY_API_KEY"]}
        // value={content}
        initialValue={content}
        init={props.getEditorConfig()}
      />
    </StyledTinyEditor>
  )
}

export default forwardRef(TinyEditor);

const StyledTinyEditor = styled.div`
    width: 100%;
    height: 100%;
`;