import styled from "styled-components";
import {useEffect, useRef} from "react";
import BlogListItem from "./BlogListItem";
import useBlogList from "./useBlogList";

export interface BlogHomeProps {
  /**
   * "following" 일 때 /blog/following 인증 엔드포인트를 사용한다.
   * 미지정 시 URL match 기반의 기존 분기를 사용 (legacy 호환).
   */
  feedMode?: "all" | "following";
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
            <BlogListItem
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
  // 시안: 단일 column 가로 카드. 글 한 편을 충분히 호흡감 있게 보여주는 레이아웃.
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
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
