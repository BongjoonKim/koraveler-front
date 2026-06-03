import {BlogHomeProps} from "./BlogList";
import {useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {
  getAllDocuments,
  getFollowingFeed,
} from "../../../../../endpoints/blog-endpoints";
import {BLOG_LIST_SORTS} from "../../../../../constants/constants";
import {useAtomValue} from "jotai/index";
import {selBlogSortOpt} from "../../../../../stores/jotai/jotai";
import useAuthEP from "../../../../../utils/useAuthEP";
import {extractTextAdvanced} from "../../../../../utils/commonUtils";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

const PAGE_SIZE = 24;

function useBlogList(props : BlogHomeProps) {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [totalDocsCnt, setTotalDocsCnt] = useState<number>(0);
  const [totalPagesCnt, setTotalPagesCnt] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const selectedOption = useAtomValue(selBlogSortOpt);
  const authEP = useAuthEP();
  const { activeLocale } = useBlogLocale();

  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);

  // 동시 요청 방지 + 최신 hasMore/page 참조 (IntersectionObserver 콜백용)
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(0);

  const fetchPage = useCallback(async (pageToFetch: number, replace: boolean) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      let dateSort = "DESC";
      if (selectedOption === BLOG_LIST_SORTS.OLD) {
        dateSort = "ASC";
      } else if (selectedOption === BLOG_LIST_SORTS.LATEST) {
        dateSort = "DESC";
      }

      let blogPosts: DocumentsInfo | undefined;

      if (props.feedMode === "following") {
        // 팔로우 피드는 항상 인증 필요. 비로그인 시 authEP 가 던지고, 호출자가 미리 막아야 함.
        const res = await authEP({
          func: getFollowingFeed,
          params: {
            page: pageToFetch,
            size: PAGE_SIZE,
            dateSort,
            locale: activeLocale,
          },
        });
        if (res.status !== 200) throw res.statusText;
        blogPosts = res.data;
      } else {
        // 본인 글/북마크/드래프트/숨김/휴지통은 MyBlogDashboard 로 이전됨.
        // BlogPage 는 공개 home 피드 전용.
        const res = await getAllDocuments({
          params: {
            page: pageToFetch,
            size: PAGE_SIZE,
            dateSort,
            locale: activeLocale,
          },
        });
        if (res?.status !== 200) throw res?.statusText;
        blogPosts = res.data;
      }

      const newDocs = (blogPosts?.documents ?? []).map((post) => ({
        ...post,
        contents: extractTextAdvanced(post?.contents),
      }));

      const total = blogPosts?.totalPagesCnt ?? 0;
      setTotalDocsCnt(blogPosts?.totalDocsCnt ?? 0);
      setTotalPagesCnt(total);
      setDocuments((prev) => (replace ? newDocs : [...prev, ...newDocs]));

      // 마지막 페이지 도달 여부: 서버가 비어있는 페이지를 주거나 totalPagesCnt에 도달한 경우 종료
      const reachedEnd = newDocs.length === 0 || pageToFetch + 1 >= total;
      hasMoreRef.current = !reachedEnd;
      setHasMore(!reachedEnd);
      pageRef.current = pageToFetch;
      setPage(pageToFetch);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: e?.toString(),
      });
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, activeLocale, authEP, props.feedMode]);

  // 필터 변경 시 처음부터 다시 로드
  useEffect(() => {
    setDocuments([]);
    setPage(0);
    pageRef.current = 0;
    setHasMore(true);
    hasMoreRef.current = true;
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, activeLocale, props.feedMode]);

  const loadMore = useCallback(() => {
    if (isLoadingRef.current || !hasMoreRef.current) return;
    fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  // 기존 컴포넌트 호환을 위해 documents/totalDocsCnt/totalPagesCnt를 묶은 객체도 제공
  const blogList: DocumentsInfo = {
    documents,
    totalDocsCnt,
    totalPagesCnt,
  };

  return {
    blogList,
    loadMore,
    hasMore,
    isLoading,
  }
}

export default useBlogList;
