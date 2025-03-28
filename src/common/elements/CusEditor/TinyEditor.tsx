import {useRef, useState} from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

function TinyEditor() {
  const edicotRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState<string>('<p></p>');
  
  
  
  return (
    <div className="editor-container">
      <Editor
        onInit={(evt, editor) => edicotRef.current = editor}
        apiKey={process.env["REACT_APP_TINY_API_KEY"]}
      />
    </div>
  )
}

export default TinyEditor;