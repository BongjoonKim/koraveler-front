// src/common/elements/CusEditor/CommentEditor.tsx

import React, { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { TextSelection } from "prosemirror-state";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import styled from "styled-components";
import ResizableImage from "./extensions/ResizableImage";

export interface CommentEditorProps {
  initialValue?: string;
  handleImageUpload?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  onChange?: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  autoFocus?: boolean;
}

const CommentEditor = forwardRef<Editor | null, CommentEditorProps>((props, ref) => {
  const {
    initialValue = "",
    handleImageUpload,
    onChange,
    placeholder = "댓글을 입력하세요...",
    minHeight = "80px",
    maxHeight = "300px",
    autoFocus = false,
  } = props;
  
  const [isDragging, setIsDragging] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 댓글에 불필요한 기능 비활성화
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
      }),
      ResizableImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "comment-link",
        },
      }),
    ],
    content: initialValue,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: "comment-editor",
        "data-placeholder": placeholder,
      },
      handleDrop: (view, event, slice, moved) => {
        setIsDragging(false);
        
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
          const files = Array.from(event.dataTransfer.files);
          const imageFile = files.find(file => file.type.startsWith("image/"));
          
          if (imageFile) {
            event.preventDefault();
            event.stopPropagation();
            
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (coordinates) {
              const tr = view.state.tr;
              tr.setSelection(TextSelection.create(view.state.doc, coordinates.pos));
              view.dispatch(tr);
            }
            
            setTimeout(() => handleImageFile(imageFile), 0);
            return true;
          }
        }
        
        return moved ? false : false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) handleImageFile(file);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onFocus: () => {
      setShowToolbar(true);
    },
  });
  
  useImperativeHandle(ref, () => editor as Editor, [editor]);
  
  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.match(/^image\//) || !handleImageUpload || !editor) {
      setIsDragging(false);
      return;
    }
    
    try {
      const blobInfo = { blob: () => file };
      const imageUrl = await handleImageUpload(blobInfo, (percent) => {
        console.log(`Upload progress: ${percent}%`);
      });
      
      if (imageUrl) {
        editor.chain().focus().setResizableImage({
          src: imageUrl,
          alt: file.name,
          title: file.name,
        }).run();
      }
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsDragging(false);
    }
  }, [handleImageUpload, editor]);
  
  // 드래그 이벤트 처리
  useEffect(() => {
    if (!editor) return;
    
    const editorElement = editor.view.dom.parentElement;
    if (!editorElement) return;
    
    let dragCounter = 0;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        e.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
      }
    };
    
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) setIsDragging(false);
    };
    
    const handleWindowDragEnd = () => {
      dragCounter = 0;
      setIsDragging(false);
    };
    
    editorElement.addEventListener("dragover", handleDragOver);
    editorElement.addEventListener("dragenter", handleDragEnter);
    editorElement.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragend", handleWindowDragEnd);
    window.addEventListener("mouseup", handleWindowDragEnd);
    
    return () => {
      editorElement.removeEventListener("dragover", handleDragOver);
      editorElement.removeEventListener("dragenter", handleDragEnter);
      editorElement.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragend", handleWindowDragEnd);
      window.removeEventListener("mouseup", handleWindowDragEnd);
      setIsDragging(false);
    };
  }, [editor]);
  
  if (!editor) return null;
  
  return (
    <StyledCommentEditor className={isDragging ? "dragging" : ""}>
      {/* 간소화된 툴바 - 포커스 시에만 표시 */}
      {showToolbar && (
        <Toolbar>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="굵게 (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="기울임 (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="취소선"
          >
            <s>S</s>
          </ToolbarButton>
          
          <Separator />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="목록"
          >
            •
          </ToolbarButton>
          
          <Separator />
          
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("URL 입력:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={editor.isActive("link") ? "is-active" : ""}
            title="링크"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                if (input.files?.[0]) await handleImageFile(input.files[0]);
              };
              input.click();
            }}
            title="이미지"
          >
            🖼️
          </ToolbarButton>
        </Toolbar>
      )}
      
      {/* 에디터 영역 */}
      <EditorContainer $minHeight={minHeight} $maxHeight={maxHeight}>
        <EditorContent editor={editor} />
      </EditorContainer>
      
      {/* 드래그 오버레이 */}
      {isDragging && (
        <DropOverlay>
          <span>📷 이미지를 여기에 놓으세요</span>
        </DropOverlay>
      )}
    </StyledCommentEditor>
  );
});

CommentEditor.displayName = "CommentEditor";

export default CommentEditor;

// 스타일 컴포넌트
const StyledCommentEditor = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    background: white;
    flex: 1;
    &.dragging .ProseMirror {
        opacity: 0.5;
    }
`;

const Toolbar = styled.div`
    display: flex;
    gap: 2px;
    padding: 6px 8px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
    padding: 4px 8px;
    border: none;
    background: transparent;
    color: #495057;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    transition: all 0.15s;

    &:hover {
        background: #e9ecef;
        color: #228be6;
    }

    &.is-active {
        background: #228be6;
        color: white;
    }

    strong, em, s {
        font-size: 13px;
    }
`;

const Separator = styled.div`
    width: 1px;
    height: 18px;
    background: #dee2e6;
    margin: 0 4px;
    align-self: center;
`;

interface EditorContainerProps {
  $minHeight: string;
  $maxHeight: string;
}

const EditorContainer = styled.div<EditorContainerProps>`
    flex: 1;
    overflow-y: auto;
    /* EditorContent가 생성하는 wrapper */
    > div {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .ProseMirror {
        min-height: ${props => props.$minHeight};
        max-height: ${props => props.$maxHeight};
        padding: 1rem;
        flex: 1;
        outline: none;
        font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        overflow-y: auto;

        &:focus {
            outline: none;
        }

        /* 플레이스홀더 - CSS 기반 */
        &:empty::before,
        &.is-empty::before {
            content: attr(data-placeholder);
            color: #adb5bd;
            pointer-events: none;
            position: absolute;
            height: 0;
            float: left;
        }

        /* 첫 번째 자식이 빈 p 태그일 때도 처리 */
        > p:only-child:empty::before {
            content: attr(data-placeholder);
            color: #adb5bd;
            pointer-events: none;
        }

        p {
            margin: 0 0 0.5em 0;

            &:last-child {
                margin-bottom: 0;
            }
        }

        ul, ol {
            padding-left: 1.5em;
            margin: 0.5em 0;
        }

        li > p {
            display: inline-block;
        }

        a {
            color: #228be6;
            text-decoration: none;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }

        /* 이미지 스타일 */
        .resizable-image-wrapper {
            user-select: none;
            margin: 0.5em 0;

            img {
                max-width: 100%;
                border-radius: 4px;
            }
        }

        code {
            background: #f1f3f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: "Consolas", monospace;
            font-size: 0.9em;
        }
    }
`;

const DropOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(34, 139, 230, 0.1);
    border: 2px dashed #228be6;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;

    span {
        background: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        color: #228be6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
`;