// src/types/quill-modules.d.ts
// Quill 관련 모듈들의 타입 선언 파일

declare module 'quill-image-drop-module' {
  export class ImageDrop {
    constructor(quill: any, options?: any);
  }
}

declare module 'quill-image-resize-module-react' {
  const ImageResize: any;
  export default ImageResize;
}

// Quill 모듈 인터페이스 확장
declare module 'react-quill' {
  import { Component } from 'react';
  
  interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    modules?: any;
    formats?: string[];
    theme?: string;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    onChange?: (
      content: string,
      delta: any,
      source: string,
      editor: any
    ) => void;
    onChangeSelection?: (
      selection: any,
      source: string,
      editor: any
    ) => void;
    onFocus?: (
      selection: any,
      source: string,
      editor: any
    ) => void;
    onBlur?: (
      previousSelection: any,
      source: string,
      editor: any
    ) => void;
    onKeyPress?: React.EventHandler<any>;
    onKeyDown?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    preserveWhitespace?: boolean;
    className?: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
  }
  
  export interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): any;
    getSelection(focus?: boolean): any;
    getContents(index?: number, length?: number): any;
  }
  
  export default class ReactQuill extends Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
  }
}