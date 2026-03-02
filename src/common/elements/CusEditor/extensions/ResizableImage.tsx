// src/common/elements/CusEditor/extensions/ResizableImage.tsx

import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

// 크기 조절 프리셋
const SIZE_PRESETS = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

// 리사이즈 가능한 이미지 컴포넌트
const ResizableImageComponent = (props: any) => {
  const { node, updateAttributes, selected, editor, getPos } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  
  // 이미지의 원본 크기 저장
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  }, []);
  
  // 퍼센트 기반 크기 조절
  const setImageSizePercent = useCallback(
    (percent: number) => {
      if (!containerRef.current?.parentElement) return;
      
      const parentWidth = containerRef.current.parentElement.offsetWidth - 40; // padding 고려
      const newWidth = Math.round((parentWidth * percent) / 100);
      
      // 원본 비율 유지
      const aspectRatio = naturalSize.width / naturalSize.height || 1;
      const newHeight = Math.round(newWidth / aspectRatio);
      
      updateAttributes({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    },
    [updateAttributes, naturalSize]
  );
  
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
  
  // 현재 크기가 몇 퍼센트인지 계산 (node.attrs.width 기반)
  const getCurrentPercent = useCallback(() => {
    if (!containerRef.current?.parentElement) return null;

    const widthAttr = node.attrs.width;
    if (!widthAttr) return null;

    const pxValue = parseInt(String(widthAttr), 10);
    if (isNaN(pxValue)) return null;

    const parentWidth = containerRef.current.parentElement.offsetWidth - 40;
    const percent = Math.round((pxValue / parentWidth) * 100);

    // 가장 가까운 프리셋 찾기
    const closest = SIZE_PRESETS.find(p => Math.abs(p.value - percent) <= 5);
    return closest?.value || null;
  }, [node.attrs.width]);
  
  return (
    <NodeViewWrapper
      className="resizable-image-wrapper"
      onClick={(e: React.MouseEvent) => {
        // 이미지 컨테이너 밖(빈 공간) 클릭 시 선택 해제
        const container = containerRef.current;
        if (container && !container.contains(e.target as any) && editor) {
          e.preventDefault();
          // 이미지 노드 다음 위치로 커서 이동
          const pos = typeof getPos === 'function' ? getPos() : null;
          if (pos !== null) {
            editor.chain().focus().setTextSelection(pos + node.nodeSize).run();
          }
        }
      }}
      style={{
        display: "flex",
        justifyContent: node.attrs.align === "center" ? "center" :
          node.attrs.align === "right" ? "flex-end" : "flex-start",
        width: "100%",
        margin: "1em 0",
      }}
    >
      <ImageContainer
        ref={containerRef}
        data-drag-handle
      >
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          title={node.attrs.title || ""}
          onLoad={handleImageLoad}
          style={{
            width: node.attrs.width || "auto",
            height: node.attrs.height || "auto",
            maxWidth: "100%",
            display: "block",
            borderRadius: "4px",
            cursor: isResizing ? "default" : "pointer",
            outline: selected ? "2px solid #4a90e2" : "none",
            outlineOffset: "2px",
          }}
          draggable={false}
        />
        
        {/* 크기 조절 버튼 - 선택됐을 때만 표시 */}
        {selected && !isResizing && (
          <SizeButtonContainer>
            {SIZE_PRESETS.map((preset) => (
              <SizeButton
                key={preset.value}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageSizePercent(preset.value);
                }}
                $isActive={getCurrentPercent() === preset.value}
                title={`이미지 크기 ${preset.label}로 설정`}
              >
                {preset.label}
              </SizeButton>
            ))}
          </SizeButtonContainer>
        )}
        
        {/* 리사이즈 핸들들 - 선택됐을 때만 표시 */}
        {selected && !isResizing && (
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
      </ImageContainer>
    </NodeViewWrapper>
  );
};

// 스타일 컴포넌트
const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
`;

const SizeButtonContainer = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: white;
  padding: 6px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 20;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
  }
`;

const SizeButton = styled.button<{ $isActive: boolean }>`
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#4a90e2' : '#ddd')};
  background: ${({ $isActive }) => ($isActive ? '#4a90e2' : 'white')};
  color: ${({ $isActive }) => ($isActive ? 'white' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4a90e2;
    background: ${({ $isActive }) => ($isActive ? '#4a90e2' : '#f0f7ff')};
  }
`;

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
  
  // HTML → 노드
  parseHTML() {
    return [
      // figure로 감싸진 이미지 파싱
      {
        tag: "figure[data-align] img",
        getAttrs: (dom: any) => {
          const figure = dom.closest("figure");
          return {
            src: dom.getAttribute("src"),
            alt: dom.getAttribute("alt"),
            title: dom.getAttribute("title"),
            width: dom.style.width || dom.getAttribute("width") || "400px",
            height: dom.style.height || dom.getAttribute("height") || "auto",
            align: figure?.getAttribute("data-align") || dom.getAttribute("data-align") || "center",
          };
        },
      },
      // 일반 이미지 파싱
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
  
  // 중요: Node => HTML로 변환하여 보여줌. HTML 출력 시 정렬 정보와 스타일 포함
  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width, height, align } = HTMLAttributes;
    
    // 이미지를 감싸는 figure와 함께 출력하여 정렬 유지
    return [
      "figure",
      {
        style: `display: flex; justify-content: ${
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"
        }; margin: 1em 0;`,
        "data-align": align,
      },
      [
        "img",
        {
          src,
          alt: alt || "",
          title: title || "",
          style: `width: ${width}; height: ${height}; max-width: 100%; border-radius: 4px;`,
          "data-align": align,
        },
      ],
    ];
  },
  
  // 화면 렌더링의 역할을 가지고 있음. ProseMirror Doc => React Component
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