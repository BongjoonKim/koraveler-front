import styled from "styled-components";
import {useEffect, useRef} from "react";
import SimpleDocViewer from "../../../../../common/layout/BlogLayout/BlogList/SimpleDocViewer/SimpleDocViewer";
import useBlogList from "./useBlogList";

export interface BlogHomeProps {

};

function BlogList(props: BlogHomeProps) {
  const {
    blogList,
    isTrashView,
    handleRestore,
    loadMore,
    hasMore,
    isLoading,
  } = useBlogList(props);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤: sentinel이 화면에 보이면 다음 페이지 로드
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        // 화면 하단에 도달하기 약간 전에 미리 로드
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <StyledBlogListWrapper>
      <StyledBlogList>
        {blogList?.documents?.map(blog => {
          return (
            <SimpleDocViewer
              key={blog.id}
              {...blog}
              trashMode={isTrashView}
              onRestore={handleRestore}
            />
          )
        })}
      </StyledBlogList>
      {hasMore && <StyledSentinel ref={sentinelRef} aria-hidden />}
      {isLoading && <StyledLoader>Loading…</StyledLoader>}
    </StyledBlogListWrapper>
  )
};

export default BlogList;

const StyledBlogListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledBlogList = styled.ul`
  //padding: 2rem;
  display: grid;
  grid-template-columns: repeat(1, 100%);
  grid-auto-rows: fit-content();
  grid-gap: 2rem;
  width: 100%;

  @media screen and (min-width: 720px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 1rem));
    grid-gap: 2rem;
    //width: 100%;
  }

  @media screen and (min-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(3, calc(33.3% - 2rem * 2 / 3));
    grid-gap: 2rem;
    //width: 100%;
  }

  @media screen and (min-width: 1500px) {
    display: grid;
    grid-template-columns: repeat(3, calc(33.3%  - 2rem * 2 / 3));
    grid-gap: 2rem;

  @media screen and (min-width: 1800px) {
    display: grid;
    grid-template-columns: repeat(3, calc(33.3%  - 2rem * 2 / 3));
    grid-gap: 2rem;
    max-width: 1800px;
`;

const StyledSentinel = styled.div`
  width: 100%;
  height: 1px;
`;

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  color: #888;
  font-size: 0.9rem;
`;
