// src/common/elements/CusEditor/extensions/ResizableVideo.tsx

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";

// Type declaration for the command
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableVideo: {
      setResizableVideo: (options: {
        src: string;
        width?: number;
        height?: number;
        controls?: boolean;
      }) => ReturnType;
    };
  }
}

// Video Node Extension
const ResizableVideo = Node.create({
  name: "resizableVideo",
  
  group: "block",
  
  atom: true,
  
  draggable: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 640,
      },
      height: {
        default: 360,
      },
      controls: {
        default: true,
      },
      autoplay: {
        default: false,
      },
      loop: {
        default: false,
      },
      muted: {
        default: false,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-video-wrapper]',
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const video = element.querySelector('video');
          if (!video) return false;
          
          const widthMatch = element.style.width?.match(/(\d+)/);
          
          return {
            src: video.getAttribute('src'),
            width: widthMatch ? parseInt(widthMatch[1]) : 640,
            height: video.getAttribute('height') ? parseInt(video.getAttribute('height')!) : 360,
            controls: video.hasAttribute('controls'),
            autoplay: video.hasAttribute('autoplay'),
            loop: video.hasAttribute('loop'),
            muted: video.hasAttribute('muted'),
          };
        },
      },
      {
        tag: 'video',
        getAttrs: (node) => {
          const element = node as HTMLVideoElement;
          return {
            src: element.getAttribute('src'),
            width: element.getAttribute('width') ? parseInt(element.getAttribute('width')!) : 640,
            height: element.getAttribute('height') ? parseInt(element.getAttribute('height')!) : 360,
            controls: element.hasAttribute('controls'),
            autoplay: element.hasAttribute('autoplay'),
            loop: element.hasAttribute('loop'),
            muted: element.hasAttribute('muted'),
          };
        },
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-video-wrapper": "", style: `width: ${HTMLAttributes.width}px` },
      [
        "video",
        mergeAttributes(HTMLAttributes, {
          controls: HTMLAttributes.controls,
          style: "width: 100%; height: auto;",
        }),
      ],
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ResizableVideoComponent);
  },
  
  addCommands() {
    return {
      setResizableVideo:
        (options: {
          src: string;
          width?: number;
          height?: number;
          controls?: boolean;
        }) =>
          ({ chain }) => {
            return chain()
              .insertContent({
                type: this.name,
                attrs: options,
              })
              .run();
          },
    };
  },
});

// 크기 조절 프리셋
const SIZE_PRESETS = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

// Video Component with Resize
const ResizableVideoComponent: React.FC<NodeViewProps> = ({
                                                            node,
                                                            updateAttributes,
                                                            selected,
                                                          }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { src, width, height, controls, autoplay, loop, muted } = node.attrs;
  
  // 퍼센트 기반 크기 조절
  const setVideoSizePercent = useCallback(
    (percent: number) => {
      if (!wrapperRef.current?.parentElement) return;

      const parentWidth = wrapperRef.current.parentElement.offsetWidth - 40;
      const newWidth = Math.round((parentWidth * percent) / 100);
      const newHeight = Math.round(newWidth / aspectRatio);

      updateAttributes({ width: newWidth, height: newHeight });
    },
    [updateAttributes, aspectRatio]
  );

  // 현재 크기가 몇 퍼센트인지 계산 (node.attrs.width 기반)
  const getCurrentPercent = useCallback(() => {
    if (!wrapperRef.current?.parentElement) return null;

    const pxValue = typeof width === "number" ? width : parseInt(String(width), 10);
    if (isNaN(pxValue)) return null;

    const parentWidth = wrapperRef.current.parentElement.offsetWidth - 40;
    const percent = Math.round((pxValue / parentWidth) * 100);

    const closest = SIZE_PRESETS.find(p => Math.abs(p.value - percent) <= 5);
    return closest?.value || null;
  }, [width]);

  // 비디오 로드 시 aspect ratio 계산
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const ratio = video.videoWidth / video.videoHeight;
      setAspectRatio(ratio);
      
      // 초기 높이 설정
      if (!height || height === 360) {
        updateAttributes({
          height: Math.round(width / ratio),
        });
      }
    }
  }, [width, height, updateAttributes]);
  
  // 리사이즈 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        if (direction.includes("e")) {
          newWidth = Math.max(200, startWidth + deltaX);
        }
        if (direction.includes("w")) {
          newWidth = Math.max(200, startWidth - deltaX);
        }
        if (direction.includes("s")) {
          newHeight = Math.max(100, startHeight + deltaY);
        }
        if (direction.includes("n")) {
          newHeight = Math.max(100, startHeight - deltaY);
        }
        
        // Shift 키로 aspect ratio 유지
        if (moveEvent.shiftKey) {
          if (direction.includes("e") || direction.includes("w")) {
            newHeight = Math.round(newWidth / aspectRatio);
          } else {
            newWidth = Math.round(newHeight * aspectRatio);
          }
        }
        
        updateAttributes({
          width: newWidth,
          height: newHeight,
        });
      };
      
      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("blur", handleMouseUp);
        
      };
      
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // 추가: 브라우저 포커스 이탈 시에도 리사이즈 종료
      window.addEventListener("blur", handleMouseUp);
    },
    [width, height, aspectRatio, updateAttributes]
  );
  
  useEffect(() => {
    // 컴포넌트 언마운트 시 혹시 남아있는 이벤트 정리
    return () => {
      setIsResizing(false);
    };
  }, []);
  
  return (
    <NodeViewWrapper
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <VideoWrapper
        ref={wrapperRef}
        className={`resizable-video-wrapper ${selected ? "selected" : ""}`}
        style={{ width: `${width}px` }}
        data-drag-handle
      >
        <StyledVideo
          ref={videoRef}
          src={src}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          onLoadedMetadata={handleLoadedMetadata}
          style={{
            height: `${height}px`,
            pointerEvents: isResizing ? "none" : "auto"
          }}
        />
        
        {selected && (
          <>
            {/* 리사이즈 핸들들 */}
            <ResizeHandle
              className="resize-handle nw"
              onMouseDown={(e) => handleMouseDown(e, "nw")}
            />
            <ResizeHandle
              className="resize-handle ne"
              onMouseDown={(e) => handleMouseDown(e, "ne")}
            />
            <ResizeHandle
              className="resize-handle sw"
              onMouseDown={(e) => handleMouseDown(e, "sw")}
            />
            <ResizeHandle
              className="resize-handle se"
              onMouseDown={(e) => handleMouseDown(e, "se")}
            />
            <ResizeHandle
              className="resize-handle n"
              onMouseDown={(e) => handleMouseDown(e, "n")}
            />
            <ResizeHandle
              className="resize-handle s"
              onMouseDown={(e) => handleMouseDown(e, "s")}
            />
            <ResizeHandle
              className="resize-handle e"
              onMouseDown={(e) => handleMouseDown(e, "e")}
            />
            <ResizeHandle
              className="resize-handle w"
              onMouseDown={(e) => handleMouseDown(e, "w")}
            />
          </>
        )}
        
        {/* 크기 조절 버튼 */}
        {selected && !isResizing && (
          <SizeButtonContainer>
            {SIZE_PRESETS.map((preset) => (
              <SizeButton
                key={preset.value}
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoSizePercent(preset.value);
                }}
                $isActive={getCurrentPercent() === preset.value}
                title={`비디오 크기 ${preset.label}로 설정`}
              >
                {preset.label}
              </SizeButton>
            ))}
          </SizeButtonContainer>
        )}

        {/* 사이즈 표시 */}
        {selected && (
          <SizeIndicator>
            {width} × {height}
          </SizeIndicator>
        )}
      </VideoWrapper>
    </NodeViewWrapper>
  );
};

export default ResizableVideo;

// Styled Components
const VideoWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 100%;
    margin: 1em 0;
    display: flex;
    justify-content: center;
    &.selected {
        outline: 2px solid #4a90e2;
        outline-offset: 2px;
    }
`;

const StyledVideo = styled.video`
    width: 100%;
    display: block;
    border-radius: 4px;
    background: #000;
`;

const ResizeHandle = styled.div`
    position: absolute;
    width: 10px;
    height: 10px;
    background: #4a90e2;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 10;

    &.nw {
        top: -5px;
        left: -5px;
        cursor: nw-resize;
    }
    &.ne {
        top: -5px;
        right: -5px;
        cursor: ne-resize;
    }
    &.sw {
        bottom: -5px;
        left: -5px;
        cursor: sw-resize;
    }
    &.se {
        bottom: -5px;
        right: -5px;
        cursor: se-resize;
    }
    &.n {
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        cursor: n-resize;
    }
    &.s {
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        cursor: s-resize;
    }
    &.e {
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        cursor: e-resize;
    }
    &.w {
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
        cursor: w-resize;
    }
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

const SizeIndicator = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
`;