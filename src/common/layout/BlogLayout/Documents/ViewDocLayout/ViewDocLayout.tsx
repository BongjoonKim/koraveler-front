// src/common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout.tsx

import styled from "styled-components";
import {ReactNode} from "react";
import moment from "moment";
import CusButton from "../../../../elements/buttons/CusButton";
import useViewDocLayout from "./useViewDocLayout";
import { CiBookmark } from "react-icons/ci";
import {IoBookmarkSharp, IoChatbubbleOutline, IoEyeOutline, IoHeartOutline} from "react-icons/io5";
import CusIconButton from "../../../../elements/buttons/CusIconButton";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import {View} from "lucide-react";

export interface ViewDocLayoutProps extends DocumentDTO{
  children ?: ReactNode;
  isBookmarked ?: boolean;
}

function ViewDocLayout(props: ViewDocLayoutProps) {
  const {
    handleDelete,
    handleEdit,
    changeBookmark,
    currentUser,
    views,
  } = useViewDocLayout(props);
  
  console.log("views", views)
  
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <HStack gap={2} fontSize="l" fontWeight="500">
              <Text color="gray.600">
                {moment(props.updated).format("YYYY.MM.DD")}
              </Text>
              <Text color="gray.400">/</Text>
              <Text color="gray.700">
                {props.updatedUser}
              </Text>
            </HStack>
            
            <HStack gap={2}>
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
                  <CusIconButton
                    aria-label="like"
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                  >
                    <HStack gap={1}>
                      <IoHeartOutline />
                      <Text fontSize="sm">{0}</Text>
                    </HStack>
                  </CusIconButton>
                </>
              )}
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
          
          {/* 둘째 줄: 통계 + Edit/Del */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
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
          </Box>
        </VStack>
        
        {/* 콘텐츠 */}
        <Box className="contents">
          {props.children}
        </Box>
      </VStack>
    </StyledViewDocLayout>
  )
}

export default ViewDocLayout;

const StyledViewDocLayout = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
`;