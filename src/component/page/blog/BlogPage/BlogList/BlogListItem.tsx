import React, {useMemo} from "react";
import styled from "styled-components";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {S3URLInDocument} from "../../../../../constants/RegexConstants";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";
import {trackBlogPostClick} from "../../../../../utils/analytics";

export interface BlogListItemProps extends DocumentDTO {}

// 썸네일 없는 글의 색 스와치 팔레트. 시안의 sage/peach/dusty-blue 톤.
const SWATCH_PALETTE = [
  "#c9d4be", // sage
  "#e9c9b0", // peach
  "#bcc6d4", // dusty blue
  "#d4c8be", // sand
  "#c2cfca", // mint
  "#d8c4bd", // clay
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function swatchFor(id?: string): string {
  if (!id) return SWATCH_PALETTE[0];
  return SWATCH_PALETTE[hashStr(id) % SWATCH_PALETTE.length];
}

function readMinutes(text?: string): number | null {
  if (!text || text.length < 50) return null;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function BlogListItem(props: BlogListItemProps) {
  const navigate = useNavigate();
  const {activeLocale, blogViewUrl} = useBlogLocale();

  const cleanContents = useMemo(
    () => props.contents?.replace(S3URLInDocument, "")?.trim() || "",
    [props.contents]
  );
  const mins = readMinutes(cleanContents);
  const category = props.tags?.[0]; // 시안의 FOOD/CULTURE/NATURE 위치
  const swatch = useMemo(() => swatchFor(props.id), [props.id]);

  const handleClick = () => {
    if (!props.id) return;
    trackBlogPostClick({
      postId: props.id,
      postTitle: props.title,
      source: "blog_list",
      locale: activeLocale,
      category,
    });
    navigate(blogViewUrl(props.id));
  };

  return (
    <StyledItem
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="thumb">
        {props.thumbnailImgUrl ? (
          <img src={props.thumbnailImgUrl} alt="" loading="lazy" />
        ) : (
          <div className="swatch" style={{background: swatch}} aria-hidden />
        )}
      </div>

      <div className="content">
        {category && <span className="category">{category}</span>}
        <h3 className="title">{props.title}</h3>
        <p className="desc">{cleanContents}</p>
        <div className="meta">
          <span>{moment(props.updated).format("MMM D, YYYY")}</span>
          {mins && <span>· {mins} min</span>}
          {props.updatedUser && <span className="author">· {props.updatedUser}</span>}
        </div>
      </div>
    </StyledItem>
  );
}

export default BlogListItem;

const StyledItem = styled.li`
  list-style: none;
  cursor: pointer;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  transition: opacity 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover .title {
    color: rgba(255, 255, 255, 1);
  }
  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.4);
    outline-offset: 4px;
    border-radius: 4px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 96px 1fr;
    gap: 1rem;
    padding: 1rem 0;
  }

  .thumb {
    width: 160px;
    height: 160px;
    border-radius: 6px;
    overflow: hidden;
    background: #1f2728;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .swatch {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 720px) {
      width: 96px;
      height: 96px;
    }
  }

  .content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .category {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.55);
    }

    .title {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.95);
      margin: 0;
      transition: color 0.15s ease;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .desc {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      line-height: 1.55;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta {
      margin-top: auto;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.78rem;

      .author {
        opacity: 0.85;
      }
    }
  }

`;
