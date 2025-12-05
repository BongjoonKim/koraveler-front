// src/common/elements/CusEditor/TiptapViewer.tsx

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import styled from "styled-components";

export interface TiptapViewerProps {
  contents?: string;
}

// 뷰어용 이미지 확장 (figure 태그 지원)
const ViewerImage = Image.extend({
  name: "image",
  
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      "data-align": { default: "center" },
    };
  },
  
  parseHTML() {
    return [
      // figure로 감싸진 이미지
      {
        tag: "figure[data-align] img",
        getAttrs: (dom: any) => {
          const figure = dom.closest("figure");
          return {
            src: dom.getAttribute("src"),
            alt: dom.getAttribute("alt"),
            title: dom.getAttribute("title"),
            width: dom.style.width || dom.getAttribute("width"),
            height: dom.style.height || dom.getAttribute("height"),
            "data-align": figure?.getAttribute("data-align") || "center",
          };
        },
      },
      // 일반 이미지
      {
        tag: "img[src]",
        getAttrs: (dom: any) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
          width: dom.style.width || dom.getAttribute("width"),
          height: dom.style.height || dom.getAttribute("height"),
          "data-align": dom.getAttribute("data-align") || "center",
        }),
      },
    ];
  },
});

function TiptapViewer({ contents }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      ViewerImage.configure({
        HTMLAttributes: {
          class: "viewer-image",
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "tiptap-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: "viewer-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: contents || "",
    editable: false, // 읽기 전용
    editorProps: {
      attributes: {
        class: "tiptap-viewer",
      },
    },
  });
  
  // contents가 변경되면 에디터 내용 업데이트
  React.useEffect(() => {
    if (editor && contents) {
      editor.commands.setContent(contents);
    }
  }, [editor, contents]);
  
  if (!contents) {
    return null;
  }
  
  return (
    <StyledTiptapViewer>
      <EditorContent editor={editor} />
    </StyledTiptapViewer>
  );
}

export default TiptapViewer;

const StyledTiptapViewer = styled.div`
  width: 100%;
  
  .tiptap-viewer {
    font-family: Arial, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    
    &:focus {
      outline: none;
    }
    
    /* figure 태그 스타일 - 이미지 정렬 */
    figure {
      margin: 1em 0;
      
      &[data-align="center"] {
        display: flex;
        justify-content: center;
      }
      
      &[data-align="right"] {
        display: flex;
        justify-content: flex-end;
      }
      
      &[data-align="left"] {
        display: flex;
        justify-content: flex-start;
      }
    }
    
    /* 이미지 스타일 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      
      &[data-align="center"] {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      
      &[data-align="right"] {
        display: block;
        margin-left: auto;
      }
      
      &[data-align="left"] {
        display: block;
      }
    }

    h1 {
      font-size: 32px;
      font-weight: bold;
      margin: 0.67em 0;
      line-height: 1.2;
      color: #222;
    }

    h2 {
      font-size: 28px;
      font-weight: bold;
      margin: 0.75em 0;
      line-height: 1.3;
      color: #333;
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      margin: 0.83em 0;
      line-height: 1.4;
      color: #333;
    }

    h4 {
      font-size: 20px;
      font-weight: bold;
      margin: 1em 0;
      line-height: 1.4;
      color: #444;
    }

    h5 {
      font-size: 18px;
      font-weight: bold;
      margin: 1.2em 0;
      line-height: 1.5;
      color: #444;
    }

    h6 {
      font-size: 16px;
      font-weight: bold;
      margin: 1.4em 0;
      line-height: 1.5;
      color: #555;
    }

    p {
      margin: 1em 0;
    }

    blockquote {
      border-left: 4px solid #4a90e2;
      padding: 0.5em 1em;
      margin: 1.5em 0;
      background-color: #f8f9fa;
      font-style: italic;
      color: #555;
    }

    pre {
      background-color: #282c34;
      color: #abb2bf;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      margin: 1em 0;

      code {
        background: none;
        color: inherit;
        padding: 0;
        font-size: inherit;
      }
    }

    code {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 0.9em;
      color: #c7254e;
    }

    a {
      color: #4a90e2;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    ul {
      list-style-type: disc;
      list-style-position: inside;
      padding-left: 2em;
    }

    ol {
      list-style-type: decimal;
      list-style-position: inside;
      padding-left: 2em;
    }

    li {
      display: list-item;
      
      > p {
        display: inline-block;
        margin: 0;
      }
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      table-layout: fixed;

      td,
      th {
        border: 1px solid #ddd;
        padding: 8px;
        vertical-align: top;
        min-width: 100px;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #f8f9fa;
        font-weight: bold;
        text-align: left;
      }
    }

    hr {
      border: 0;
      height: 1px;
      background: #e0e0e0;
      margin: 2em 0;
    }
    
    /* 강조 스타일 */
    mark {
      background-color: #fff3cd;
      padding: 0.1em 0.2em;
      border-radius: 2px;
    }
    
    /* 취소선 */
    s {
      text-decoration: line-through;
    }
    
    /* 밑줄 */
    u {
      text-decoration: underline;
    }
  }
`;