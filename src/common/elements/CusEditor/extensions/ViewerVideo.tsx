// src/common/elements/CusEditor/extensions/ViewerVideo.tsx

import { Node, mergeAttributes } from "@tiptap/core";

// Viewer용 Video Node Extension (읽기 전용)
const ViewerVideo = Node.create({
  name: "resizableVideo", // Editor에서 저장한 노드 이름과 동일해야 함
  
  group: "block",
  
  atom: true,
  
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
      // Editor에서 저장된 형식 파싱
      {
        tag: 'div[data-video-wrapper]',
        getAttrs: (dom: HTMLElement) => {
          const video = dom.querySelector('video');
          const width = dom.style.width?.replace('px', '') || 640;
          return {
            src: video?.getAttribute('src'),
            width: parseInt(String(width)),
            height: video?.clientHeight || "360px",
            controls: video?.hasAttribute('controls') ?? true,
          };
        },
      },
      // 일반 video 태그
      {
        tag: "video[src]",
        getAttrs: (dom: HTMLElement) => ({
          src: dom.getAttribute("src"),
          width: dom.getAttribute("width") || dom.style.width?.replace('px', '') || 640,
          height: dom.getAttribute("height") || dom.style.height?.replace('px', '') || 360,
          controls: dom.hasAttribute("controls"),
          autoplay: dom.hasAttribute("autoplay"),
          loop: dom.hasAttribute("loop"),
          muted: dom.hasAttribute("muted"),
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    const { src, width, height, controls, autoplay, loop, muted } = HTMLAttributes;
    
    return [
      "div",
      {
        "data-video-wrapper": "",
        class: "viewer-video-wrapper",
        style: `width: 100%; max-width: 100%; height: 100%; display: flex; justify-content: center `,
      },
      [
        "video",
        {
          src,
          controls: controls ? "true" : null,
          autoplay: autoplay ? "true" : null,
          loop: loop ? "true" : null,
          muted: muted ? "true" : null,
          style: `width: ${width}px; height: ${height}px;`,
        },
      ],
    ];
  },
});

export default ViewerVideo;