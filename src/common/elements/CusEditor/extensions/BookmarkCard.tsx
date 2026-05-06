// src/common/elements/CusEditor/extensions/BookmarkCard.tsx
//
// Notion 스타일 북마크 카드 Node.
// - 메타데이터(title/description/image/favicon)는 insert 시점에 attrs로 저장 → 뷰 시점 재fetch 없음
// - image 유무에 따라 "심플 카드"와 "리치 카드"가 자동 전환 (스크린샷의 2가지 스타일)

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState } from "react";
import styled from "styled-components";
import { getOgMetadata } from "../../../../endpoints/common-endpoints";

export interface BookmarkCardAttrs {
  url: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  favicon?: string | null;
  siteName?: string | null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bookmarkCard: {
      setBookmarkCard: (attrs: BookmarkCardAttrs) => ReturnType;
    };
  }
}

const BookmarkCardComponent = (props: any) => {
  const { node, selected, editor, getPos, updateAttributes } = props;
  const { url, title, description, image, favicon, siteName } = node.attrs as BookmarkCardAttrs;
  const [refreshing, setRefreshing] = useState(false);

  const hasImage = !!image;
  const displayTitle = title || url;
  const displayHost = siteName || safeHost(url);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const { data } = await getOgMetadata(url);
      updateAttributes({
        title: data.title ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        favicon: data.favicon ?? null,
        siteName: data.siteName ?? null,
      });
    } catch (e) {
      console.error("북마크 메타데이터 새로고침 실패", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    // 에디터 편집 중에는 카드 클릭 시 새 탭 열리지 않도록 가드
    if (editor?.isEditable) return;
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <NodeViewWrapper className="bookmark-card-wrapper">
      <CardLink
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpen}
        $selected={!!selected}
        $hasImage={hasImage}
        data-drag-handle
      >
        <CardText $hasImage={hasImage}>
          <CardTitle>{displayTitle}</CardTitle>
          {description && <CardDesc>{description}</CardDesc>}
          <CardMeta>
            {favicon && (
              <FaviconImg
                src={favicon}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <CardUrl>{displayHost ? `${displayHost}` : url}</CardUrl>
          </CardMeta>
        </CardText>
        {hasImage && (
          <CardImageWrap>
            <CardImage
              src={image!}
              alt=""
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </CardImageWrap>
        )}
      </CardLink>

      {editor?.isEditable && selected && (
        <CardActions contentEditable={false}>
          <CardActionButton onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "..." : "↻ 새로고침"}
          </CardActionButton>
          <CardActionButton
            onClick={() => {
              const pos = typeof getPos === "function" ? getPos() : null;
              if (pos == null) return;
              editor
                .chain()
                .focus()
                .deleteRange({ from: pos, to: pos + node.nodeSize })
                .run();
            }}
          >
            🗑 삭제
          </CardActionButton>
        </CardActions>
      )}
    </NodeViewWrapper>
  );
};

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

export const BookmarkCard = Node.create({
  name: "bookmarkCard",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      url: { default: null },
      title: { default: null },
      description: { default: null },
      image: { default: null },
      favicon: { default: null },
      siteName: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-bookmark-card]",
        getAttrs: (dom: any) => ({
          url: dom.getAttribute("data-url"),
          title: dom.getAttribute("data-title"),
          description: dom.getAttribute("data-description"),
          image: dom.getAttribute("data-image"),
          favicon: dom.getAttribute("data-favicon"),
          siteName: dom.getAttribute("data-site-name"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // 저장 HTML — 뷰어가 BookmarkCard extension 없이 열어도 의미를 유지하도록
    // 내부에 최소한의 앵커 텍스트도 남김
    const { url, title, description, image, favicon, siteName } = HTMLAttributes;
    return [
      "div",
      mergeAttributes(
        {
          "data-bookmark-card": "true",
          "data-url": url || "",
          "data-title": title || "",
          "data-description": description || "",
          "data-image": image || "",
          "data-favicon": favicon || "",
          "data-site-name": siteName || "",
          class: "bookmark-card",
        }
      ),
      ["a", { href: url || "#", target: "_blank", rel: "noopener noreferrer" }, title || url || ""],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BookmarkCardComponent);
  },

  addCommands() {
    return {
      setBookmarkCard:
        (attrs: BookmarkCardAttrs) =>
        ({ chain, state }: any) => {
          const { selection } = state;
          const pos = selection.$head.pos;
          return chain()
            .insertContentAt(pos, {
              type: this.name,
              attrs: {
                url: attrs.url,
                title: attrs.title ?? null,
                description: attrs.description ?? null,
                image: attrs.image ?? null,
                favicon: attrs.favicon ?? null,
                siteName: attrs.siteName ?? null,
              },
            })
            .run();
        },
    };
  },
});

export default BookmarkCard;

// ===== 스타일 =====

const CardLink = styled.a<{ $selected: boolean; $hasImage: boolean }>`
  display: flex;
  align-items: stretch;
  gap: 0;
  text-decoration: none;
  color: inherit;
  border: 1px solid ${({ $selected }) => ($selected ? "#4a90e2" : "rgba(255,255,255,0.15)")};
  border-radius: 8px;
  overflow: hidden;
  margin: 0.75em 0;
  background: transparent;
  transition: border-color 0.15s ease, background 0.15s ease;
  min-height: ${({ $hasImage }) => ($hasImage ? "120px" : "auto")};

  &:hover {
    border-color: #4a90e2;
    background: rgba(74, 144, 226, 0.04);
  }
`;

const CardText = styled.div<{ $hasImage: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`;

const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #e6e6e6;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: light) {
    color: #222;
  }
`;

const CardDesc = styled.div`
  font-size: 13px;
  color: #9aa0a6;
  line-height: 1.45;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const FaviconImg = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  object-fit: contain;
  flex-shrink: 0;
`;

const CardUrl = styled.span`
  font-size: 12px;
  color: #9aa0a6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const CardImageWrap = styled.div`
  width: 240px;
  flex-shrink: 0;
  background: #111;
  overflow: hidden;

  @media (max-width: 640px) {
    width: 120px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
  margin: 4px 0 8px 0;
`;

const CardActionButton = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #4a90e2;
    color: #4a90e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
