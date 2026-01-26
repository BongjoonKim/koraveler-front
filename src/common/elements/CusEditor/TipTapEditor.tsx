// src/common/elements/CusEditor/TiptapEditor.tsx

import React, { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { TextSelection } from "prosemirror-state";
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
import Gapcursor from "@tiptap/extension-gapcursor";
import styled from "styled-components";
import ResizableImage from "./extensions/ResizableImage";
import {columnResizing, tableEditing, goToNextCell, fixTables, mergeCells, splitCell} from 'prosemirror-tables';
import ResizableVideo from "./extensions/ResizableVideo";


// Type definitions for Tiptap extensions
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ResizableImage: {
      setResizableImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
    ResizableVideo: {
      setResizableVideo: (options: {
        src: string;
        width?: number;
        height?: number;
        controls?: boolean;
      }) => ReturnType;
    };
  }
}

export interface TiptapEditorProps {
  initialValue?: string;
  handleImageUpload?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  handleVideoUpload?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const TiptapEditor = forwardRef<Editor | null, TiptapEditorProps>((props, ref) => {
  const { initialValue = "", handleImageUpload, handleVideoUpload, onChange, placeholder = "내용을 입력하세요..." } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [isTableActive, setIsTableActive] = useState(false);
  const [draggedTable, setDraggedTable] = useState<any>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      ResizableImage,
      ResizableVideo,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
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
      Gapcursor,
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 25,
        allowTableNodeSelection: true,
        lastColumnResizable: true,
      }).extend({
        addProseMirrorPlugins() {
          const plugins = [];
          
          if (this.options.resizable) {
            plugins.push(
              columnResizing({
                handleWidth: this.options.handleWidth,
                cellMinWidth: this.options.cellMinWidth,
                lastColumnResizable: this.options.lastColumnResizable,
              })
            );
          }
          
          plugins.push(
            tableEditing({
              allowTableNodeSelection: this.options.allowTableNodeSelection,
            })
          );
          
          return plugins;
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        "data-placeholder": placeholder,
      },
      handleDrop: (view, event, slice, moved) => {
        // 드래그 상태 즉시 해제
        setIsDragging(false);
        
        console.log("드롭 처리", event)
        
        // 파일 드롭 처리
        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = Array.from(event.dataTransfer.files);
          const imageFile = files.find(file => file.type.startsWith("image/"));
          const videoFile = files.find(file => file.type.startsWith("video/"));
          
          console.log("files", files)
          
          if (imageFile) {
            event.preventDefault();
            event.stopPropagation();
            
            // 드롭 위치에 커서 이동
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (coordinates) {
              const pos = coordinates.pos;
              const tr = view.state.tr;
              tr.setSelection(TextSelection.create(view.state.doc, pos));
              view.dispatch(tr);
            }
            
            // 이미지 파일 처리
            setTimeout(() => {
              handleImageFile(imageFile);
            }, 0);
            
            return true;
          }
          
          if (videoFile) {
            event.preventDefault();
            event.stopPropagation();
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (coordinates) {
              const pos = coordinates.pos;
              const tr = view.state.tr;
              tr.setSelection(TextSelection.create(view.state.doc, pos));
              view.dispatch(tr);
            }
            
            setTimeout(() => {
              handleVideoFile(videoFile);
            }, 0);
            
            return true;
          }
        }
        
        // moved가 true면 Tiptap의 기본 드래그 앤 드롭 처리 (노드 이동 등)
        if (moved) {
          return false;
        }
        
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf("image") !== -1) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                handleImageFile(file);
              }
              return true;
            }
          }
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        // Backspace 키로 테이블 삭제 처리
        if (event.key === 'Backspace') {
          const { state, dispatch } = view;
          const { selection, doc } = state;
          const { $from } = selection;
          
          // 현재 커서 위치 확인
          const pos = $from.pos;
          
          // 커서 바로 앞 노드가 테이블인지 확인
          if (pos > 0) {
            const nodeBefore = doc.resolve(pos - 1);
            let tableNode = null;
            let tablePos = -1;
            
            // 테이블 노드 찾기
            for (let d = nodeBefore.depth; d >= 0; d--) {
              const node = nodeBefore.node(d);
              if (node.type.name === 'table') {
                tableNode = node;
                tablePos = nodeBefore.before(d);
                break;
              }
            }
            
            // 테이블 바로 뒤에 커서가 있는 경우
            if (tableNode && tablePos >= 0) {
              const tableEnd = tablePos + tableNode.nodeSize;
              
              // 커서가 테이블 바로 뒤에 있는지 확인
              if (pos === tableEnd || pos === tableEnd + 1) {
                event.preventDefault();
                
                // 테이블 삭제 트랜잭션 생성
                const tr = state.tr.delete(tablePos, tableEnd);
                dispatch(tr);
                return true;
              }
            }
          }
        }
        
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });
  
  // 에디터 인스턴스를 ref로 노출
  useImperativeHandle(ref, () => editor as Editor, [editor]);
  
  // 이미지 업로드 처리
  const handleImageFile = useCallback(
    async (file: File) => {
      if (!file.type.match(/^image\//)) {
        console.error("Not an image file");
        setIsDragging(false); // 에러 시에도 상태 해제
        return;
      }
      
      if (handleImageUpload && editor) {
        try {
          // 로딩 상태 표시 (옵션)
          console.log("Uploading image:", file.name);
          
          const progress = (percent: number) => {
            console.log(`Upload progress: ${percent}%`);
          };
          
          const blobInfo = {
            blob: () => file,
          };
          
          const imageUrl = await handleImageUpload(blobInfo, progress);
          
          if (imageUrl) {
            // ResizableImage 노드 삽입 - Tiptap 커스텀 명령 사용
            editor
              .chain()
              .focus()
              .setResizableImage({
                src: imageUrl,
                alt: file.name,
                title: file.name,
              })
              .run();
            
            console.log("Image inserted successfully");
          }
        } catch (error) {
          console.error("Failed to upload image", error);
          alert("이미지 업로드에 실패했습니다.");
        } finally {
          // 업로드 완료 후 항상 드래그 상태 해제
          setIsDragging(false);
        }
      } else {
        setIsDragging(false);
      }
    },
    [handleImageUpload, editor]
  );
  
  const handleVideoFile = useCallback(async (file : File) => {
    if (!file.type.match(/^video\//)) {
      console.error("Not a video file");
      setIsDragging(false);
      return;
    }
    
    if (handleVideoUpload && editor) {
      try {
        console.log("Uploading video:", file.name);
        
        const progress = (percent: number) => {
          console.log(`Upload progress: ${percent}%`);
        };
        
        const blobInfo = {
          blob: () => file,
        }
        
        const videoUrl = await handleVideoUpload(blobInfo, progress);
        
        if (videoUrl) {
          editor
            .chain()
            .focus()
            .setResizableVideo({
              src: videoUrl,
              width: 640,
              height: 360,
              controls: true,
            })
            .run();
          console.log("Video inserted successfully");
        }
      } catch (error) {
        console.error("Failed to upload video", error);
        alert("비디오 업로드에 실패했습니다.");
      } finally {
        setIsDragging(false);
      }
    } else {
      setIsDragging(false)
    }
  }, [handleVideoUpload, editor])
  
  // TiptapEditor 컴포넌트 내부에 커스텀 명령어 추가
  const handleMergeCells = useCallback(() => {
    if (!editor) return;
    
    const { state, dispatch } = editor.view;
    mergeCells(state, dispatch);
    editor.view.focus();
  }, [editor]);
  
  const handleSplitCell = useCallback(() => {
    if (!editor) return;
    
    const { state, dispatch } = editor.view;
    splitCell(state, dispatch);
    editor.view.focus();
  }, [editor]);

// 셀이 병합 가능한지 확인하는 함수
  const canMergeCells = useCallback(() => {
    if (!editor) return false;
    
    const { state } = editor.view;
    return mergeCells(state);
  }, [editor]);

// 셀이 분할 가능한지 확인하는 함수
  const canSplitCell = useCallback(() => {
    if (!editor) return false;
    
    const { state } = editor.view;
    return splitCell(state);
  }, [editor]);
  
  // TiptapEditor 컴포넌트 내부에 테이블 감지 함수 추가
  const isInTable = useCallback(() => {
    if (!editor) return false;
    
    const { selection } = editor.state;
    const { $from } = selection;
    
    // 현재 선택 위치에서 테이블 노드를 찾기
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'table') {
        return true;
      }
    }
    
    // 또는 부모 노드들 중 테이블 관련 노드가 있는지 확인
    return !!(
      editor.isActive('tableCell') ||
      editor.isActive('tableHeader') ||
      editor.isActive('tableRow')
    );
  }, [editor]);

// 테이블 활성 상태를 추적하기 위한 state 추가

// editor 업데이트 시 테이블 활성 상태 확인
  useEffect(() => {
    if (!editor) return;
    
    const updateTableState = () => {
      setIsTableActive(isInTable());
    };
    
    // 초기 상태 설정
    updateTableState();
    
    // 에디터 업데이트 시 상태 확인
    editor.on('selectionUpdate', updateTableState);
    editor.on('update', updateTableState);
    
    return () => {
      editor.off('selectionUpdate', updateTableState);
      editor.off('update', updateTableState);
    };
  }, [editor, isInTable]);
  
  // 테이블 드래그 핸들 표시를 위한 useEffect
  useEffect(() => {
    if (!editor) return;
    
    const { view } = editor;
    
    const updateTableHandles = () => {
      const tables = view.dom.querySelectorAll('table');
      
      tables.forEach((table: any) => {
        // 이미 핸들이 있으면 스킵
        if (table.previousSibling?.classList?.contains('table-drag-handle')) return;
        
        // 테이블 래퍼 생성
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper-with-handle';
        wrapper.style.position = 'relative';
        
        // 드래그 핸들 생성
        const handle = document.createElement('div');
        handle.className = 'table-drag-handle';
        handle.innerHTML = '⋮⋮'; // 드래그 아이콘
        handle.draggable = true;
        handle.contentEditable = 'false';
        
        // 드래그 이벤트 처리
        handle.addEventListener('dragstart', (e) => {
          e.dataTransfer!.effectAllowed = 'move';
          e.dataTransfer!.setData('text/html', table.outerHTML);
          setDraggedTable(table);
          table.style.opacity = '0.5';
        });
        
        handle.addEventListener('dragend', () => {
          if (draggedTable) {
            draggedTable.style.opacity = '1';
            setDraggedTable(null);
          }
        });
        
        // 테이블을 래퍼로 감싸기
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(handle);
        wrapper.appendChild(table);
      });
    };
    
    // 초기 실행
    updateTableHandles();
    
    // 에디터 업데이트 시 실행
    editor.on('update', updateTableHandles);
    
    return () => {
      editor.off('update', updateTableHandles);
    };
  }, [editor, draggedTable]);
  
  // 드래그 오버 이벤트
  useEffect(() => {
    if (!editor) return;
    
    const editorElement = editor.view.dom.parentElement;
    if (!editorElement) return;
    
    let dragCounter = 0; // 드래그 enter/leave 카운터
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // 파일이 드래그되고 있는지 확인
      if (e.dataTransfer?.types.includes("Files")) {
        e.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
      }
    };
    
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      dragCounter++;
      
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      dragCounter--;
      
      // 모든 요소를 벗어났을 때만 상태 해제
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };
    
    const handleDrop = async (e: DragEvent) => {
      // e.preventDefault();
      // e.stopPropagation();

      // 드래그 상태 즉시 리셋
      dragCounter = 0;
      setIsDragging(false);

      // 파일 처리는 editorProps.handleDrop에서 처리됨
    };

    // 윈도우 레벨에서 드래그 종료 감지
    const handleWindowDragEnd = () => {
      dragCounter = 0;
      setIsDragging(false);
    };

    // 이벤트 리스너 등록
    editorElement.addEventListener("dragover", handleDragOver);
    editorElement.addEventListener("dragenter", handleDragEnter);
    editorElement.addEventListener("dragleave", handleDragLeave);
    // editorElement.addEventListener("drop", handleDrop);
    window.addEventListener("dragend", handleWindowDragEnd);
    window.addEventListener("mouseup", handleWindowDragEnd); // 안전장치

    return () => {
      // 이벤트 리스너 제거
      editorElement.removeEventListener("dragover", handleDragOver);
      editorElement.removeEventListener("dragenter", handleDragEnter);
      editorElement.removeEventListener("dragleave", handleDragLeave);
      // editorElement.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragend", handleWindowDragEnd);
      window.removeEventListener("mouseup", handleWindowDragEnd);

      // 컴포넌트 언마운트 시 상태 리셋
      setIsDragging(false);
    };
  }, [editor]);
  
  if (!editor) {
    return null;
  }
  
  return (
    <StyledTiptapEditor className={isDragging ? "dragging" : ""}>
      {/* 툴바 */}
      <Toolbar>
        {/* Heading 선택 */}
        <ToolbarGroup>
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
              }
            }}
            value={
              editor.isActive("heading", { level: 1 })
                ? "1"
                : editor.isActive("heading", { level: 2 })
                  ? "2"
                  : editor.isActive("heading", { level: 3 })
                    ? "3"
                    : editor.isActive("heading", { level: 4 })
                      ? "4"
                      : editor.isActive("heading", { level: 5 })
                        ? "5"
                        : editor.isActive("heading", { level: 6 })
                          ? "6"
                          : "0"
            }
          >
            <option value="0">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 텍스트 스타일 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "is-active" : ""}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 정렬 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
            title="Align Left"
          >
            ≡
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
            title="Align Center"
          >
            ≣
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
            title="Align Right"
          >
            ≡
          </ToolbarButton>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 리스트 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Numbered List"
          >
            1. List
          </ToolbarButton>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 인용 & 코드 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
            title="Blockquote"
          >
            ❝ Quote
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
            title="Code Block"
          >
            &lt;/&gt; Code
          </ToolbarButton>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 이미지 & 링크 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.click();
              
              input.onchange = async () => {
                if (input.files && input.files[0]) {
                  await handleImageFile(input.files[0]);
                }
              };
            }}
            title="Insert Image"
          >
            🖼️ Image
          </ToolbarButton>
          
          {/* Video Button */}
          <ToolbarButton
            onClick={() => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "video/*");
              input.click();
              
              input.onchange = async () => {
                if (input.files && input.files[0]) {
                  await handleVideoFile(input.files[0]);
                }
              };
            }}
            title="Insert Video"
          >
            🎬 Video
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "is-active" : ""}
            title="Insert Link"
          >
            🔗 Link
          </ToolbarButton>
        </ToolbarGroup>
        
        <Separator />
        
        {/* 테이블 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            disabled={isTableActive}
            title="Insert Table"
          >
            ⊞ Table
          </ToolbarButton>
          {isTableActive && (
            <>
              {/* 열 관련 버튼 */}
              <ToolbarButton
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                title="Add Column Before"
              >
                ← Col
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                title="Add Column After"
              >
                → Col
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.can().deleteColumn()}
                title="Delete Column"
              >
                ✕ Col
              </ToolbarButton>
              
              {/* 행 관련 버튼 */}
              <ToolbarButton
                onClick={() => editor.chain().focus().addRowBefore().run()}
                title="Add Row Before"
              >
                ↑ Row
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().addRowAfter().run()}
                title="Add Row After"
              >
                ↓ Row
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.can().deleteRow()}
                title="Delete Row"
              >
                ✕ Row
              </ToolbarButton>
              
              {/* 병합 관련 버튼 */}
              <ToolbarButton
                onClick={() => editor.chain().focus().mergeCells().run()}
                // disabled={!canMergeCells()}
                title="Merge Cells"
              >
                ⊞ Merge
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().splitCell().run()}
                // disabled={!canSplitCell()}
                title="Split Cell"
              >
                ⊟ Split
              </ToolbarButton>
              
              {/* 테이블 삭제 */}
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete Table"
                style={{ color: '#d32f2f' }}
              >
                ✕ Table
              </ToolbarButton>
            </>
          )}
        </ToolbarGroup>
        
        <Separator />
        
        {/* 실행 취소/다시 실행 */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
      
      {/* 에디터 */}
      <EditorContainer>
        <EditorContent editor={editor} />
      </EditorContainer>
      {/*<div*/}
      {/*  style={{*/}
      {/*    height: "200rem",*/}
      {/*    overflow: "auto",*/}
      {/*    flex: 1,*/}
      {/*    flexShrink: 1*/}
      {/*  }}*/}
      {/*>*/}
      {/*  sdfsdfsdf*/}
      {/*  sdf*/}
      {/*  <p>sdfsdf</p>*/}
      {/*  <p>sdfsdf</p>*/}
      {/*  <p>sdfsdf</p>*/}
      {/*</div>*/}
      
      {/* 드래그 오버레이 */}
      {isDragging && (
        <DropOverlay>
          <DropMessage>
            <span>📷</span>
            <p>Drop your Image or Video</p>
          </DropMessage>
        </DropOverlay>
      )}
    </StyledTiptapEditor>
  );
});

TiptapEditor.displayName = "TiptapEditor";

export default TiptapEditor;

// 스타일 컴포넌트들
const StyledTiptapEditor = styled.div`
    width: 100%;
    height: 0;      /* 추가 */
    flex: 1;
    min-height: 0;     /* 추가 */
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;

    &.dragging {
        .ProseMirror {
            opacity: 0.6;
        }
    }
`;

const Toolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
    align-items: center;

    select {
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        font-size: 14px;
        cursor: pointer;
        min-width: 120px;

        &:focus {
            outline: none;
            border-color: #4a90e2;
        }
    }
`;

const ToolbarGroup = styled.div`
    display: flex;
    gap: 2px;
`;

const ToolbarButton = styled.button<{ disabled?: boolean }>`
    padding: 6px 10px;
    border: 1px solid #ddd;
    background: white;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover:not(:disabled) {
        background: #f5f5f5;
        border-color: #4a90e2;
        color: #4a90e2;
    }

    &.is-active {
        background: #4a90e2;
        color: white;
        border-color: #4a90e2;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    strong,
    em,
    u,
    s {
        font-size: 14px;
    }
`;

const Separator = styled.div`
    width: 1px;
    height: 24px;
    background: #ddd;
    margin: 0 4px;
`;

const EditorContainer = styled.div`
    flex: 1;
    overflow-y: auto;  /* 여기서 스크롤 */
    background: white;
    min-height: 0;
    height: 0;

    /* EditorContent가 생성하는 wrapper */
    > div {
        min-height: 100%;
        //display: flex;
        //flex-direction: column;
    }
    //
    //> .tiptap {
    //    flex: 1;
    //    min-height: 0;
    //    overflow-y: auto
    //}
    
    .ProseMirror {
        min-height: 100%;
        padding: 20px;
        outline: none;
        font-family: Arial, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333;

        ul {
            list-style-type: disc;  /* 불릿 스타일 명시 */
            list-style-position: inside;  /* 리스트 마커를 안쪽에 표시 */
        }

        ol {
            list-style-type: decimal;  /* 번호 스타일 명시 */
            list-style-position: inside;  /* 리스트 마커를 안쪽에 표시 */
        }

        li {
            display: list-item;  /* 리스트 아이템으로 명시적 표시 */
        }

        li > p {
            display: inline-block;
        }

        &.ProseMirror-focused {
            outline: none;
        }

        /* 플레이스홀더 */
        &:empty::before {
            content: attr(data-placeholder);
            color: #aaa;
            pointer-events: none;
            position: absolute;
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
            margin: 0em 0;
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

        /* 리사이즈 가능한 이미지 래퍼 스타일 */
        .resizable-image-wrapper {
            user-select: none;

            img {
                transition: outline 0.15s;
            }
        }
        
        /* 비디오 스타일 */
        .resizable-video-wrapper {
            user-select: none;

            video {
                transition: outline 0.15s;
            }

            &.selected {
                video {
                    outline: 2px solid #4a90e2;
                }
            }
        }
        
        ul,
        ol {
            padding-left: 2em;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
            table-layout: fixed;
            position: relative;

            td,
            th {
                border: 1px solid #ddd;
                padding: 8px;
                position: relative;
                vertical-align: top;
                min-width: 100px;
                box-sizing: border-box;

                > * {
                    margin-bottom: 0;
                }

                &:last-child {
                    width: auto;
                }
            }

            th {
                background-color: #f8f9fa;
                font-weight: bold;
                text-align: left;
            }

            .selectedCell {
                background-color: #e3f2fd;
            }

            /* 테이블 셀 리사이즈 핸들 스타일 */
            .tableWrapper {
                position: relative;
                overflow-x: auto;
            }

            .table-wrapper-with-handle {
                position: relative;
                margin: 1em 0;

                &:hover .table-drag-handle {
                    opacity: 1;
                }
            }

            .table-drag-handle {
                position: absolute;
                left: -30px;
                top: 0;
                width: 20px;
                height: 30px;
                background: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                user-select: none;
                opacity: 0;
                transition: opacity 0.2s;
                font-size: 12px;
                color: #666;

                &:hover {
                    background: #e0e0e0;
                    border-color: #4a90e2;
                    color: #4a90e2;
                }

                &:active {
                    background: #d0d0d0;
                }
            }

            /* 드래그 중인 테이블 스타일 */
            table.dragging {
                opacity: 0.5;
                cursor: move;
            }

            /* 드롭 존 표시 */
            .drop-indicator {
                height: 2px;
                background: #4a90e2;
                margin: 10px 0;
                position: relative;

                &::before {
                    content: '▼';
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #4a90e2;
                    font-size: 12px;
                }
            }

            /* ProseMirror 테이블 선택 */
            &.ProseMirror-selectednode {
                outline: 3px solid #4a90e2;
            }

            /* 컬럼 리사이즈 핸들 */
            .column-resize-handle {
                position: absolute;
                right: -2px;
                top: 0;
                bottom: -2px;
                width: 4px;
                background-color: #4a90e2;
                pointer-events: all;
                cursor: col-resize;
                opacity: 0;
                transition: opacity 0.2s;

                &:hover {
                    opacity: 1;
                }
            }

            /* 테이블 전체 셀렉션을 위한 스타일 */
            .prosemirror-dropcursor-block {
                background-color: rgba(74, 144, 226, 0.2);
            }

            .prosemirror-dropcursor-inline {
                height: 1.5em;
                background-color: #4a90e2;
            }
        }

        /* Gapcursor 스타일 - 테이블 외부 선택 시 */
        .ProseMirror-gapcursor {
            display: none;
            pointer-events: none;
            position: absolute;
            width: 20px;

            &:after {
                content: '';
                display: block;
                position: absolute;
                top: -2px;
                width: 20px;
                border-top: 1px solid #4a90e2;
                animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
            }
        }

        @keyframes ProseMirror-cursor-blink {
            to {
                visibility: hidden;
            }
        }

        /* 테이블 리사이즈 관련 추가 스타일 */
        .resize-cursor {
            cursor: col-resize;
        }

        .tableWrapper {
            overflow-x: auto;
            margin: 1em 0;
        }

        /* prosemirror-tables specific styles */
        .ProseMirror .tableWrapper {
            overflow-x: auto;
        }

        .ProseMirror table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            overflow: hidden;
        }

        .ProseMirror td,
        .ProseMirror th {
            vertical-align: top;
            box-sizing: border-box;
            position: relative;
        }

        .ProseMirror .column-resize-handle {
            position: absolute;
            right: -2px;
            top: 0;
            bottom: 0;
            width: 5px;
            z-index: 20;
            background-color: #adf;
            pointer-events: all;
            cursor: col-resize;
        }

        .ProseMirror.resize-cursor {
            cursor: col-resize;
        }

        /* 선택된 셀 스타일 */
        .ProseMirror .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(200, 200, 255, 0.4);
            pointer-events: none;
        }

        hr {
            border: 0;
            height: 1px;
            background: #e0e0e0;
            margin: 2em 0;
        }
    }
`;

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