// src/common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout.tsx

import styled from "styled-components";
import {ReactNode} from "react";
import moment from "moment";
import useViewDocLayout from "./useViewDocLayout";
import { CiBookmark } from "react-icons/ci";
import {IoBookmarkSharp, IoChatbubbleOutline, IoEyeOutline, IoHeart, IoHeartOutline} from "react-icons/io5";
import CusIconButton from "../../../../elements/buttons/CusIconButton";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import DocComment from "../DocComment/DocComment";
import CommentSection from "./CommentSection";
import { InArticleAd } from "../../../../widget/AdSense";
import LanguageSwitcher from "../../../../../component/page/blog/common/LanguageSwitcher";
import TranslationBanner from "../../../../../component/page/blog/common/TranslationBanner";
import {ViewBlogI18nState} from "../../../../../component/page/blog/ViewBlog/useViewBlog";
import {Languages} from "lucide-react";
import {useNavigate} from "react-router-dom";

export interface ViewDocLayoutProps extends DocumentDTO{
  children ?: ReactNode;
  isBookmarked ?: boolean;
  i18nState ?: ViewBlogI18nState;
}

function ViewDocLayout(props: ViewDocLayoutProps) {
  const {
    handleDelete,
    handleEdit,
    changeBookmark,
    currentUser,
    views,
    likeStatus,
    handleToggleLike,
    isLiking,
  } = useViewDocLayout(props);

  const navigate = useNavigate();
  const i18n = props.i18nState;
  const hasI18n = i18n && i18n.availableLocales.length > 0;

  // 작성자 본인만 수정/삭제 노출 (createdUser = userId). 백엔드에서도 강제하지만 UI에서도 숨김.
  const isOwner =
    !!currentUser?.id &&
    !!props.createdUser &&
    (props.createdUser === currentUser.id || props.createdUser === currentUser.username);

  return (
    <StyledViewDocLayout>
      <VStack gap={4} align="stretch">
        {/* 제목 */}
        <Text fontSize="4xl" fontWeight="600" lineHeight="shorter" color="white">
          {props.title}
        </Text>

        {/* 중간 정보 섹션 */}
        <VStack align="stretch" gap={2}>
          {/* 첫 줄: 날짜/작성자 + 북마크/좋아요 */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <HStack gap={2} fontSize="l" fontWeight="500" flexWrap="wrap">
              <Text color="gray.300">
                {moment(props.updated).format("YYYY.MM.DD")}
              </Text>
              <Text color="gray.500">/</Text>
              <Text color="gray.200">
                {props.updatedUser}
              </Text>
            </HStack>

            <HStack gap={2} flexWrap="wrap">
              {currentUser?.id && (
                <>
                  <CusIconButton
                    aria-label={props?.isBookmarked ? 'bookmark-checked' : 'bookmark-not-check'}
                    variant="ghost"
                    onClick={changeBookmark}
                    size="sm"
                    style={{ color: props?.isBookmarked ? "#f3c969" : "#c7d2cc" }}
                  >
                    {props?.isBookmarked ? <IoBookmarkSharp/> : <CiBookmark />}
                  </CusIconButton>
                </>
              )}
              {/* 좋아요 버튼 - 로그인한 사용자만 클릭 가능 */}
              <CusIconButton
                aria-label="like"
                variant="ghost"
                size="sm"
                onClick={handleToggleLike}
                disabled={isLiking}
                style={{ color: likeStatus?.isLiked ? "#f17a6e" : "#c7d2cc" }}
              >
                <HStack gap={1}>
                  {likeStatus?.isLiked ? <IoHeart /> : <IoHeartOutline />}
                  <Text fontSize="sm" style={{ color: "inherit" }}>{likeStatus?.likeCount ?? 0}</Text>
                </HStack>
              </CusIconButton>
              {isOwner && (
                <HStack gap={2}>
                  <ActionButton type="button" onClick={handleEdit}>
                    Edit
                  </ActionButton>
                  <ActionButton type="button" $danger onClick={handleDelete}>
                    Del
                  </ActionButton>
                </HStack>
              )}
            </HStack>

          </Box>

          {/* 둘째 줄: 통계 */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <HStack gap={4} fontSize="sm" color="gray.400">
              <HStack gap={1}>
                <IoEyeOutline color="#94a3a0" />
                <Text>{views?.totalViews ?? 0}</Text>
              </HStack>
              <HStack gap={1}>
                <IoChatbubbleOutline color="#94a3a0" />
                <Text>{0}</Text>
              </HStack>
            </HStack>
            {/* 셋째 줄: 언어 선택 + 번역 관리 (통계 아래) */}
            {hasI18n && (
              <Box display="flex" alignItems="center" gap="10px" pt={1} flexWrap="wrap">
                <LanguageSwitcher
                  availableLocales={i18n.availableLocales}
                  currentLocale={i18n.currentLocale}
                  onLocaleChange={i18n.onLocaleChange}
                />
                {/* 작성자에게만 번역 관리 링크 */}
                {currentUser?.id && (
                  <ManageTranslationsLink
                    onClick={() => navigate(`/blog/translations/${props.id}`)}
                  >
                    <Languages size={13} />
                    Manage Translations
                  </ManageTranslationsLink>
                )}
              </Box>
            )}
          </Box>
        </VStack>

        {/* 번역 배너: 원본이 아닌 다른 언어로 보고 있을 때 */}
        {i18n && i18n.isTranslated && (
          <TranslationBanner
            originalLocale={i18n.originalLocale}
            currentLocale={i18n.currentLocale}
            translatedBy={i18n.translatedBy}
            onViewOriginal={i18n.onViewOriginal}
          />
        )}

        {/* 콘텐츠 */}
        <Box className="contents">
          {props.children}
        </Box>
      </VStack>

      {/* 본문 끝 ~ 댓글 사이 인아티클 광고 (AdSense) */}
      <InArticleAd />

      <CommentSection documentId={props.id!} />
    </StyledViewDocLayout>
  )
}

export default ViewDocLayout;

const StyledViewDocLayout = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;

    @media (max-width: 640px) {
        padding: 0.75rem 0.25rem;
    }
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px 14px;
    border-radius: 8px;
    border: 1px solid ${({ $danger }) => ($danger ? "rgba(241, 122, 110, 0.4)" : "rgba(80, 107, 92, 0.45)")};
    background: transparent;
    color: ${({ $danger }) => ($danger ? "#f17a6e" : "#b6d4c1")};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;

    &:hover {
        background: ${({ $danger }) => ($danger ? "rgba(241, 122, 110, 0.12)" : "rgba(46, 87, 62, 0.18)")};
        border-color: ${({ $danger }) => ($danger ? "rgba(241, 122, 110, 0.6)" : "rgba(80, 107, 92, 0.65)")};
        color: ${({ $danger }) => ($danger ? "#ff8a7a" : "#d8ead8")};
    }
`;

const ManageTranslationsLink = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 8px;
    border: 1px solid rgba(80, 107, 92, 0.35);
    background: transparent;
    color: #b6d4c1;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(46, 87, 62, 0.18);
        border-color: rgba(80, 107, 92, 0.55);
        color: #d8ead8;
    }
`;
