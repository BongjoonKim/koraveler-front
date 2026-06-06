import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {Box, Container} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {PenLine} from "lucide-react";
import BlogList from "./BlogList";
import BlogHero from "./BlogHero";
import BlogSidebar from "./BlogSidebar";
import BlogFeedToggle, {FeedMode} from "./BlogFeedToggle";
import {useCurrentUser} from "../../../../hooks/useCurrentUser";
import {useBlogLocale} from "../../../../hooks/useBlogLocale";
import {getAllDocuments} from "../../../../endpoints/blog-endpoints";
import {useAuth} from "../../../../appConfig/AuthProvider";
import {useQuery} from "@tanstack/react-query";

export interface BlogPageProps {}

const FOLLOWING_SEEN_KEY = "nadeliv:followingSeenAt";

function BlogPage(_props: BlogPageProps) {
  const navigate = useNavigate();
  const {accessToken, isInitialized} = useAuth();
  const {data: currentUser, isLoading: isUserLoading} = useCurrentUser();
  const isLoggedIn = !!currentUser?.id;
  const {activeLocale} = useBlogLocale();

  // 운영 환경에서는 localStorage 의 refreshToken 으로 자동 로그인하는 사용자에 한해
  // /refreshToken → /getLoginUser 응답이 도착하는 순간 isLoggedIn 이 false → true 로 점프하면서
  // BlogHero / BlogList / FeedToggle 이 두 번 그려진다 (개발 환경은 응답이 ~5ms 라 체감 안 됨).
  // 인증 상태가 확정될 때까지 본문 마운트를 지연시키고 다크 배경만 먼저 노출.
  const isAuthSettling = !isInitialized || (!!accessToken && isUserLoading);

  // /blog/create-new 가 빈 draft 생성 + ProtectedRoute 우회 흐름을 담당.
  const handleWrite = () => navigate("/blog/create-new");

  // 사이드바 뱃지 기준 시각. 첫 마운트 시 로컬스토리지 → state 로 끌어옴.
  const [followingSince] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(FOLLOWING_SEEN_KEY);
  });

  const [feedMode, setFeedMode] = useState<FeedMode>("all");

  // Following 탭에 들어가면 "본 것" 으로 표시 (다음 진입까지 뱃지 0).
  useEffect(() => {
    if (feedMode === "following" && isLoggedIn && typeof window !== "undefined") {
      window.localStorage.setItem(FOLLOWING_SEEN_KEY, new Date().toISOString());
    }
  }, [feedMode, isLoggedIn]);

  // 로그아웃 상태에서는 Following 모드를 강제로 All 로 복귀.
  useEffect(() => {
    if (!isLoggedIn && feedMode === "following") setFeedMode("all");
  }, [isLoggedIn, feedMode]);

  // 히어로의 LATEST_STORY 폴백을 위해 최신 1건만 따로 캐시.
  const {data: latestSnapshot} = useQuery<DocumentsInfo>({
    queryKey: ["blog", "latest-one", activeLocale],
    queryFn: async () => {
      const res = await getAllDocuments({
        params: {page: 0, size: 1, dateSort: "DESC", locale: activeLocale},
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  const latestFallback = useMemo(
    () => latestSnapshot?.documents?.[0] ?? null,
    [latestSnapshot]
  );

  return (
    <StyledShell>
      {!isAuthSettling && (
        <Container maxW="7xl" px={{base: 4, md: 6, lg: 6}}>
          <BlogHero latestFallback={latestFallback} />

          <Layout>
            <Main>
              <FeedHeader>
                <FeedToggleWrap>
                  <BlogFeedToggle
                    mode={feedMode}
                    onChange={setFeedMode}
                    isLoggedIn={isLoggedIn}
                    followingSince={followingSince}
                  />
                </FeedToggleWrap>
                <WriteButton type="button" onClick={handleWrite}>
                  <PenLine size={14} />
                  <span>Write</span>
                </WriteButton>
              </FeedHeader>
              <BlogList feedMode={feedMode} />
            </Main>
            <Aside>
              <BlogSidebar />
            </Aside>
          </Layout>
        </Container>
      )}
    </StyledShell>
  );
}

export default BlogPage;

const StyledShell = styled(Box)`
  min-height: calc(100vh - 3rem);
  padding: 1.5rem 0 3rem;
  color: white;
  background: #0a0c0c;

  /*
   * BlogList 가 사용하는 SimpleDocViewer 는 기본 light 테마라 여기서만 다크로 덮어쓴다.
   * (다른 페이지의 SimpleDocViewer 는 그대로 light 톤 유지.)
   */
  ul li > .body {
    background: #14191a !important;
    color: rgba(255, 255, 255, 0.92);
  }
  ul li > .body .desc {
    color: rgba(255, 255, 255, 0.65);
  }
  ul li > .body .body-bottom h6 {
    color: rgba(255, 255, 255, 0.45);
  }
  ul li > .header .colorImg {
    background: #1f2728 !important;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 0.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 2.5rem;
  }
`;

const Main = styled.div`
  min-width: 0;
`;

const Aside = styled.div`
  min-width: 0;

  @media (min-width: 1024px) {
    position: sticky;
    top: 1rem;
    align-self: start;
  }
`;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
`;

const FeedToggleWrap = styled.div`
  flex: 1;
  min-width: 0;

  /* BlogFeedToggle 내부의 margin-bottom 을 FeedHeader 가 흡수. */
  & > div {
    margin-bottom: 0;
  }
`;

const WriteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #2f5743;
  border: 1px solid rgba(80, 107, 92, 0.45);
  border-radius: 999px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
  white-space: nowrap;

  &:hover {
    background: #386851;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(46, 87, 62, 0.4);
  }

  &:focus-visible {
    outline: 2px solid rgba(127, 184, 154, 0.7);
    outline-offset: 2px;
  }
`;
