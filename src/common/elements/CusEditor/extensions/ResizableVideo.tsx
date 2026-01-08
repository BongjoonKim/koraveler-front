// src/common/elements/CusEditor/extensions/ResizableVideo.tsx

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useCallback, useRef, useState } from "react";
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
      };
      
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, height, aspectRatio, updateAttributes]
  );
  
  return (
    <NodeViewWrapper>
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
          style={{ height: `${height}px` }}
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
    max-width: 100%;
    margin: 1em 0;

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