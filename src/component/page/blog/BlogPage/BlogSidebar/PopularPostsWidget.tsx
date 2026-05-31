import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {usePopularPosts} from "../../../../../hooks/useBlogQueries";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

function PopularPostsWidget() {
  const {data, isLoading} = usePopularPosts("month", 3);
  const navigate = useNavigate();
  const {blogViewUrl} = useBlogLocale();

  return (
    <StyledWrap>
      <Header>POPULAR THIS MONTH</Header>
      {isLoading && <Hint>Loading…</Hint>}
      {!isLoading && (!data || data.length === 0) && (
        <Hint>No popular posts yet.</Hint>
      )}
      {data?.map((post) => (
        <Row key={post.id} onClick={() => navigate(blogViewUrl(post.id))}>
          <Rank>{String(post.rank).padStart(2, "0")}</Rank>
          <Title>{post.title || "Untitled"}</Title>
        </Row>
      ))}
    </StyledWrap>
  );
}

export default PopularPostsWidget;

const StyledWrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Header = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.45rem 0;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background 0.15s ease;

  &:hover { background: rgba(255, 255, 255, 0.03); }
`;

const Rank = styled.span`
  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  width: 1.5rem;
  flex-shrink: 0;
`;

const Title = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Hint = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  padding: 0.25rem 0;
`;
