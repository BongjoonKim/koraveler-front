// src/common/elements/CusEditor/extensions/ResizableImage.tsx

import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useCallback, useRef, useState, useEffect } from "react";

// 리사이즈 가능한 이미지 컴포넌트
const ResizableImageComponent = (props: any) => {
  const { node, updateAttributes, selected, editor } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showHandles, setShowHandles] = useState(false);
  
  // 이미지 클릭 시 핸들 표시
  useEffect(() => {
    setShowHandles(selected);
  }, [selected]);
  
  // 리사이즈 시작
  const startResize = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = imageRef.current?.offsetWidth || 0;
      const startHeight = imageRef.current?.offsetHeight || 0;
      const aspectRatio = startWidth / startHeight;
      
      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!containerRef.current?.parentElement) return;
        
        const parentWidth = containerRef.current.parentElement.offsetWidth;
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        // 방향에 따른 리사이즈 계산
        if (direction.includes("e")) {
          newWidth = startWidth + (moveEvent.clientX - startX);
        } else if (direction.includes("w")) {
          newWidth = startWidth - (moveEvent.clientX - startX);
        }
        
        // 모서리 핸들의 경우 비율 유지
        if (direction === "se" || direction === "sw" || direction === "ne" || direction === "nw") {
          if (direction.includes("s")) {
            newHeight = startHeight + (moveEvent.clientY - startY);
          } else if (direction.includes("n")) {
            newHeight = startHeight - (moveEvent.clientY - startY);
          }
          
          // 비율 유지 - 더 큰 변경사항 기준으로 조정
          const widthChange = Math.abs(newWidth - startWidth);
          const heightChange = Math.abs(newHeight - startHeight);
          
          if (widthChange > heightChange) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }
        
        // 최소/최대 크기 제한
        const minWidth = 50;
        const maxWidth = parentWidth;
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        
        // px 값으로 저장
        updateAttributes({
          width: `${Math.round(newWidth)}px`,
          height: aspectRatio ? `${Math.round(newWidth / aspectRatio)}px` : 'auto',
        });
      };
      
      const onMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = getCursor(direction);
      document.body.style.userSelect = "none";
    },
    [updateAttributes]
  );
  
  const getCursor = (direction: string) => {
    const cursors: Record<string, string> = {
      e: "ew-resize",
      w: "ew-resize",
      se: "nwse-resize",
      sw: "nesw-resize",
      ne: "nesw-resize",
      nw: "nwse-resize",
    };
    return cursors[direction] || "pointer";
  };
  
  return (
    <NodeViewWrapper
      className="resizable-image-wrapper"
      style={{
        display: node.attrs.align === "center" ? "flex" : "inline-block",
        justifyContent: node.attrs.align === "center" ? "center" : "flex-start",
        width: "100%",
        margin: "1em 0",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "100%",
        }}
        data-drag-handle
      >
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          style={{
            width: node.attrs.width || "auto",
            height: node.attrs.height || "auto",
            maxWidth: "100%",
            display: "block",
            borderRadius: "4px",
            cursor: isResizing ? "default" : "pointer",
            outline: showHandles ? "2px solid #4a90e2" : "none",
            outlineOffset: "2px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowHandles(true);
          }}
          draggable={false}
        />
        
        {/* 리사이즈 핸들들 - 선택됐을 때만 표시 */}
        {showHandles && !isResizing && (
          <>
            {/* 모서리 핸들 */}
            <ResizeHandle
              position="se"
              onMouseDown={(e) => startResize(e, "se")}
              style={{ bottom: -6, right: -6, cursor: "nwse-resize" }}
            />
            <ResizeHandle
              position="sw"
              onMouseDown={(e) => startResize(e, "sw")}
              style={{ bottom: -6, left: -6, cursor: "nesw-resize" }}
            />
            <ResizeHandle
              position="ne"
              onMouseDown={(e) => startResize(e, "ne")}
              style={{ top: -6, right: -6, cursor: "nesw-resize" }}
            />
            <ResizeHandle
              position="nw"
              onMouseDown={(e) => startResize(e, "nw")}
              style={{ top: -6, left: -6, cursor: "nwse-resize" }}
            />
            
            {/* 가장자리 핸들 */}
            <ResizeHandle
              position="e"
              onMouseDown={(e) => startResize(e, "e")}
              style={{
                top: "50%",
                right: -6,
                transform: "translateY(-50%)",
                cursor: "ew-resize",
              }}
            />
            <ResizeHandle
              position="w"
              onMouseDown={(e) => startResize(e, "w")}
              style={{
                top: "50%",
                left: -6,
                transform: "translateY(-50%)",
                cursor: "ew-resize",
              }}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// 리사이즈 핸들 컴포넌트
interface ResizeHandleProps {
  position: string;
  onMouseDown: (e: React.MouseEvent) => void;
  style: React.CSSProperties;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
                                                     position,
                                                     onMouseDown,
                                                     style,
                                                   }) => {
  return (
    <div
      className={`resize-handle resize-handle-${position}`}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        width: 12,
        height: 12,
        background: "#4a90e2",
        border: "2px solid white",
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 10,
        ...style,
      }}
    />
  );
};

// Tiptap Image Node 확장
export const ResizableImage = Node.create({
  name: "resizableImage",
  
  group: "block",
  
  atom: true,
  
  draggable: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "400px",
      },
      height: {
        default: "auto",
      },
      align: {
        default: "center",
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom: any) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
          width: dom.style.width || dom.getAttribute("width") || "400px",
          height: dom.style.height || dom.getAttribute("height") || "auto",
          align: dom.getAttribute("data-align") || "center",
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
  
  addCommands() {
    return {
      setResizableImage: (options: { src: string; alt?: string; title?: string }) => ({ chain, state }: any) => {
        const { selection } = state;
        const pos = selection.$head.pos;
        
        return chain()
          .insertContentAt(pos, {
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || '',
              title: options.title || '',
              width: '400px',
              height: 'auto',
              align: 'center',
            },
          })
          .run();
      },
    };
  },
});

export default ResizableImage;