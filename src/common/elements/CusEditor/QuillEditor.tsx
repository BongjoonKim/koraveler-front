// src/common/elements/CusEditor/QuillEditor.tsx
// modules 무한 렌더링 문제 해결 버전

import React, { forwardRef, useEffect, useRef, useState, useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

export interface QuillEditorProps {
  initialValue?: string;
  handleImageUpload?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  getEditorConfig?: () => any;
  onChange?: (content: string) => void;
  placeholder?: string;
}

// 1. 모듈 설정을 컴포넌트 밖으로 이동 (handlers 제외)
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>((props, ref) => {
  const quillRef = useRef<ReactQuill>(null);
  const { initialValue = "", handleImageUpload, onChange, placeholder } = props;
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [value, setValue] = useState(initialValue);
  
  // 2. imageHandlerRef를 사용해 함수 참조 유지
  const imageHandlerRef = useRef<() => void>(null);
  
  // 내용 변경 핸들러
  const handleChange = useCallback((content: string) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  }, [onChange]);
  
  // 이미지 업로드 처리 함수
  const processImageUpload = useCallback(async (file: File) => {
    if (!file.type.match(/^image\//)) {
      console.error("Not an image file");
      return null;
    }
    
    if (handleImageUpload) {
      try {
        const progress = (percent: number) => {
          console.log(`Upload progress: ${percent}%`);
        };
        
        const blobInfo = {
          blob: () => file,
        };
        
        const imageUrl = await handleImageUpload(blobInfo, progress);
        return imageUrl;
      } catch (error) {
        console.error("Failed to upload image", error);
        return null;
      }
    }
    return null;
  }, [handleImageUpload]);
  
  // 이미지 삽입 함수
  const insertImage = useCallback((url: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill && url) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", url);
      
      setTimeout(() => {
        const images = quill.root.querySelectorAll('img:not(.processed)');
        images.forEach((img: HTMLImageElement) => {
          img.classList.add('processed');
          img.classList.add('ql-image-medium');
          img.style.cursor = 'pointer';
          
          img.onclick = (e) => {
            e.stopPropagation();
            setSelectedImage(img);
          };
        });
      }, 100);
      
      quill.setSelection(range.index + 1);
    }
  }, []);
  
  // 3. imageHandler를 ref에 저장
  useEffect(() => {
    imageHandlerRef.current = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const imageUrl = await processImageUpload(file);
          if (imageUrl) {
            insertImage(imageUrl);
          }
        }
      };
    };
  }, [processImageUpload, insertImage]);
  
  // 이미지 크기 변경 함수
  const changeImageSize = useCallback((size: 'small' | 'medium' | 'large' | 'full') => {
    if (selectedImage) {
      selectedImage.classList.remove('ql-image-small', 'ql-image-medium', 'ql-image-large', 'ql-image-full');
      selectedImage.classList.add(`ql-image-${size}`);
      
      switch(size) {
        case 'small':
          selectedImage.style.width = '25%';
          break;
        case 'medium':
          selectedImage.style.width = '50%';
          break;
        case 'large':
          selectedImage.style.width = '75%';
          break;
        case 'full':
          selectedImage.style.width = '100%';
          break;
      }
      
      setSelectedImage(null);
    }
  }, [selectedImage]);
  
  // 4. modules를 useMemo로 생성하되 의존성 배열을 비움
  const modules = useMemo(() => ({
    toolbar: {
      container: TOOLBAR_OPTIONS,
      handlers: {
        image: () => {
          // ref를 통해 핸들러 호출
          if (imageHandlerRef.current) {
            imageHandlerRef.current();
          }
        }
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), []); // 빈 배열로 한 번만 생성
  
  // 포맷 설정
  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
    "width",
    "height",
    "style",
  ];
  
  // ref 설정
  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(quillRef.current);
      } else {
        (ref as any).current = quillRef.current;
      }
    }
  }, [ref]);
  
  // 드래그 앤 드롭 이벤트 핸들러
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    
    const container = editor.root;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
        setIsDragging(false);
      }
    };
    
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;
      
      const file = files[0];
      const imageUrl = await processImageUpload(file);
      if (imageUrl) {
        insertImage(imageUrl);
      }
    };
    
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const imageUrl = await processImageUpload(file);
            if (imageUrl) {
              insertImage(imageUrl);
            }
          }
        }
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() !== 'img') {
        setSelectedImage(null);
      }
    };
    
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("dragleave", handleDragLeave);
    container.addEventListener("drop", handleDrop);
    container.addEventListener("paste", handlePaste);
    container.addEventListener("click", handleClick);
    
    return () => {
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("dragleave", handleDragLeave);
      container.removeEventListener("drop", handleDrop);
      container.removeEventListener("paste", handlePaste);
      container.removeEventListener("click", handleClick);
    };
  }, [processImageUpload, insertImage]);
  
  // 기존 이미지에 이벤트 리스너 추가
  useEffect(() => {
    if (value && quillRef.current) {
      setTimeout(() => {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const images = quill.root.querySelectorAll('img');
          images.forEach((img: HTMLImageElement) => {
            if (!img.classList.contains('processed')) {
              img.classList.add('processed');
              img.classList.add('ql-image-medium');
              img.style.cursor = 'pointer';
              
              img.onclick = (e) => {
                e.stopPropagation();
                setSelectedImage(img);
              };
            }
          });
        }
      }, 100);
    }
  }, [value]);
  
  return (
    <StyledQuillEditor className={isDragging ? 'dragging' : ''}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "내용을 입력하세요..."}
      />
      
      {isDragging && (
        <DropOverlay>
          <DropMessage>
            <span>📷</span>
            <p>이미지를 여기에 놓으세요</p>
          </DropMessage>
        </DropOverlay>
      )}
      
      {selectedImage && (
        <ImageSizeToolbar>
          <button onClick={() => changeImageSize('small')} title="작게 (25%)">
            <span>25%</span>
          </button>
          <button onClick={() => changeImageSize('medium')} title="중간 (50%)">
            <span>50%</span>
          </button>
          <button onClick={() => changeImageSize('large')} title="크게 (75%)">
            <span>75%</span>
          </button>
          <button onClick={() => changeImageSize('full')} title="전체 (100%)">
            <span>100%</span>
          </button>
          <button onClick={() => setSelectedImage(null)} className="close" title="닫기">
            <span>✕</span>
          </button>
        </ImageSizeToolbar>
      )}
    </StyledQuillEditor>
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;

// 스타일 컴포넌트들
const DropOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(74, 144, 226, 0.1);
    border: 3px dashed #4a90e2;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const DropMessage = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    span {
        font-size: 48px;
        display: block;
        margin-bottom: 10px;
    }

    p {
        font-size: 18px;
        color: #333;
        font-weight: 500;
        margin: 0;
    }
`;

const ImageSizeToolbar = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    gap: 4px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

    button {
        min-width: 50px;
        height: 36px;
        border: 1px solid #ddd;
        background: white;
        color: #333;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        transition: all 0.2s;
        padding: 0 12px;

        &:hover {
            background: #f5f5f5;
            border-color: #4a90e2;
            color: #4a90e2;
        }

        &:active {
            background: #e8e8e8;
        }

        &.close {
            min-width: 36px;
            background: #f44336;
            color: white;
            border-color: #f44336;

            &:hover {
                background: #d32f2f;
                border-color: #d32f2f;
            }
        }

        span {
            font-size: 14px;
        }
    }
`;

const StyledQuillEditor = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    &.dragging .ql-container {
        opacity: 0.6;
    }

    .quill {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .ql-container {
        flex: 1;
        min-height: 0;
        font-size: 16px;
        font-family: Arial, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕",
        "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        transition: opacity 0.2s;
    }

    .ql-editor {
        min-height: 100%;
        padding: 20px;
        line-height: 1.6;

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

            &:hover {
                text-decoration: underline;
            }
        }

        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
            transition: all 0.3s ease;

            &.ql-image-small {
                width: 25% !important;
            }

            &.ql-image-medium {
                width: 50% !important;
            }

            &.ql-image-large {
                width: 75% !important;
            }

            &.ql-image-full {
                width: 100% !important;
            }

            &:hover {
                outline: 2px solid #4a90e2;
                outline-offset: 2px;
                cursor: pointer;
            }
        }

        ul,
        ol {
            margin: 1em 0;
            padding-left: 2em;
        }

        li {
            margin: 0.5em 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;

            td,
            th {
                border: 1px solid #ddd;
                padding: 8px;
            }

            th {
                background-color: #f8f9fa;
                font-weight: bold;
            }
        }

        hr {
            border: 0;
            height: 1px;
            background: #e0e0e0;
            margin: 2em 0;
        }
    }

    .ql-toolbar {
        border: 1px solid #e0e0e0;
        border-bottom: none;
        background: #fafafa;
    }

    .ql-container {
        border: 1px solid #e0e0e0;
    }

    .ql-editor.ql-blank::before {
        color: #aaa;
        font-style: normal;
    }

    /* 헤더 드롭다운 커스터마이징 */
    .ql-header {
        .ql-picker-label::before {
            content: "Normal";
        }

        .ql-picker-label[data-value="1"]::before {
            content: "Heading 1";
        }

        .ql-picker-label[data-value="2"]::before {
            content: "Heading 2";
        }

        .ql-picker-label[data-value="3"]::before {
            content: "Heading 3";
        }

        .ql-picker-label[data-value="4"]::before {
            content: "Heading 4";
        }

        .ql-picker-label[data-value="5"]::before {
            content: "Heading 5";
        }

        .ql-picker-label[data-value="6"]::before {
            content: "Heading 6";
        }

        .ql-picker-item[data-value="1"]::before {
            content: "Heading 1";
        }

        .ql-picker-item[data-value="2"]::before {
            content: "Heading 2";
        }

        .ql-picker-item[data-value="3"]::before {
            content: "Heading 3";
        }

        .ql-picker-item[data-value="4"]::before {
            content: "Heading 4";
        }

        .ql-picker-item[data-value="5"]::before {
            content: "Heading 5";
        }

        .ql-picker-item[data-value="6"]::before {
            content: "Heading 6";
        }
    }

    .ql-toolbar button:hover {
        color: #4a90e2;
    }

    .ql-toolbar button:hover .ql-stroke {
        stroke: #4a90e2;
    }

    .ql-toolbar button:hover .ql-fill {
        fill: #4a90e2;
    }

    .ql-toolbar .ql-active {
        color: #4a90e2;
    }

    .ql-toolbar .ql-active .ql-stroke {
        stroke: #4a90e2;
    }

    .ql-toolbar .ql-active .ql-fill {
        fill: #4a90e2;
    }
`;