// src/common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout.tsx

import styled from "styled-components";
import {ReactNode} from "react";
import moment from "moment";
import CusButton from "../../../../elements/buttons/CusButton";
import useViewDocLayout from "./useViewDocLayout";
import { CiBookmark } from "react-icons/ci";
import {IoBookmarkSharp, IoChatbubbleOutline, IoEyeOutline, IoHeart, IoHeartOutline} from "react-icons/io5";
import CusIconButton from "../../../../elements/buttons/CusIconButton";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import DocComment from "../DocComment/DocComment";
import CommentSection from "./CommentSection";
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

  return (
    <StyledViewDocLayout>
      <VStack gap={4} align="stretch">
        {/* 제목 */}
        <Text fontSize="4xl" fontWeight="600" lineHeight="shorter">
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
              <Text color="gray.600">
                {moment(props.updated).format("YYYY.MM.DD")}
              </Text>
              <Text color="gray.400">/</Text>
              <Text color="gray.700">
                {props.updatedUser}
              </Text>
            </HStack>

            <HStack gap={2} flexWrap="wrap">
              {currentUser?.id && (
                <>
                  <CusIconButton
                    aria-label={props?.isBookmarked ? 'bookmark-checked' : 'bookmark-not-check'}
                    variant="ghost"
                    colorScheme={props?.isBookmarked ? "yellow" : "gray"}
                    onClick={changeBookmark}
                    size="sm"
                  >
                    {props?.isBookmarked ? <IoBookmarkSharp/> : <CiBookmark />}
                  </CusIconButton>
                </>
              )}
              {/* 좋아요 버튼 - 로그인한 사용자만 클릭 가능 */}
              <CusIconButton
                aria-label="like"
                variant="ghost"
                colorScheme={likeStatus?.isLiked ? "red" : "gray"}
                size="sm"
                onClick={handleToggleLike}
                disabled={isLiking}
              >
                <HStack gap={1}>
                  {likeStatus?.isLiked ? <IoHeart /> : <IoHeartOutline />}
                  <Text fontSize="sm">{likeStatus?.likeCount ?? 0}</Text>
                </HStack>
              </CusIconButton>
              {currentUser?.id && (
                <HStack gap={2}>
                  <CusButton
                    variant="outline"
                    onClick={handleEdit}
                    size="sm"
                    colorScheme="blue"
                  >
                    Edit
                  </CusButton>
                  <CusButton
                    variant="outline"
                    onClick={handleDelete}
                    size="sm"
                    colorScheme="red"
                  >
                    Del
                  </CusButton>
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
                <IoEyeOutline />
                <Text>{views?.totalViews ?? 0}</Text>
              </HStack>
              <HStack gap={1}>
                <IoChatbubbleOutline />
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

const ManageTranslationsLink = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 8px;
    border: 1px solid rgba(139, 115, 85, 0.2);
    background: transparent;
    color: #8b7355;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(139, 115, 85, 0.06);
        border-color: rgba(139, 115, 85, 0.35);
    }
`;
