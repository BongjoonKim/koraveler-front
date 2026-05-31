import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {useFollowingFeed} from "../../../../../hooks/useBlogQueries";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

/**
 * "From people you follow" 위젯. 로그인 사용자에게만 표시된다.
 * 비로그인 사용자는 BlogSidebar 에서 Featured 위젯으로 대체된다.
 */
function FollowingFeedWidget({enabled}: {enabled: boolean}) {
  const navigate = useNavigate();
  const {blogViewUrl} = useBlogLocale();
  const {data, isLoading} = useFollowingFeed({page: 0, size: 3, dateSort: "DESC"}, enabled);

  if (!enabled) return null;

  const items = data?.documents ?? [];
  const isEmpty = !isLoading && items.length === 0;

  return (
    <StyledWrap>
      <Header>
        <span className="label">FROM PEOPLE YOU FOLLOW</span>
        <button type="button" className="see-all" onClick={() => navigate("/blog/home?feed=following")}>
          See all →
        </button>
      </Header>

      {isLoading && <Hint>Loading…</Hint>}

      {isEmpty && (
        <Hint>You aren't following anyone yet.</Hint>
      )}

      {!isEmpty && items.map((doc) => (
        <Item key={doc.id} onClick={() => doc.id && navigate(blogViewUrl(doc.id))}>
          <Avatar aria-hidden>{(doc.createdUser ?? "?").slice(0, 2).toUpperCase()}</Avatar>
          <div className="body">
            <div className="title" title={doc.title}>{doc.title || "Untitled"}</div>
            <div className="meta">
              {doc.createdUser && <span>{doc.createdUser}</span>}
              {doc.updated && <span> · {moment(doc.updated).fromNow()}</span>}
            </div>
          </div>
        </Item>
      ))}
    </StyledWrap>
  );
}

export default FollowingFeedWidget;

const StyledWrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.25rem;

  .label {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
  }
  .see-all {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    &:hover { color: white; }
  }
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background 0.15s ease;

  &:hover { background: rgba(255, 255, 255, 0.03); }

  .body { min-width: 0; flex: 1; }
  .title {
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.85rem;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .meta {
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.72rem;
    margin-top: 2px;
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4a5b5b, #2d3838);
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Hint = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  padding: 0.25rem 0;
`;
