// src/common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout.tsx

import styled from "styled-components";
import {ReactNode} from "react";
import moment from "moment";
import CusButton from "../../../../elements/buttons/CusButton";
import useViewDocLayout from "./useViewDocLayout";
import { CiBookmark } from "react-icons/ci";
import { IoBookmarkSharp } from "react-icons/io5";
import CusIconButton from "../../../../elements/buttons/CusIconButton";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";

export interface ViewDocLayoutProps extends DocumentDTO{
  children ?: ReactNode;
  isBookmarked ?: boolean;
}

function ViewDocLayout(props: ViewDocLayoutProps) {
  const {
    handleDelete,
    handleEdit,
    changeBookmark,
    loginUser
  } = useViewDocLayout(props);
  
  return (
    <StyledViewDocLayout>
      <VStack gap={4} align="stretch">
        {/* 제목 */}
        <Text fontSize="4xl" fontWeight="600" lineHeight="shorter">
          {props.title}
        </Text>
        
        {/* 중간 정보 섹션 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
          <HStack gap={4} fontSize="xl" fontWeight="500">
            <Text color="gray.600">
              {moment(props.updated).format("YYYY.MM.DD")}
            </Text>
            <Text color="gray.400">/</Text>
            <Text color="gray.700">
              {props.updatedUser}
            </Text>
          </HStack>
          
          {loginUser.userId && (
            <HStack gap={2}>
              <CusIconButton
                aria-label={props?.isBookmarked ? 'bookmark-checked' : 'bookmark-not-check'}
                variant="ghost"
                colorScheme={props?.isBookmarked ? "yellow" : "gray"}
                onClick={changeBookmark}
                size="sm"
              >
                {props?.isBookmarked ? <IoBookmarkSharp/> : <CiBookmark />}
              </CusIconButton>
              <CusButton
                variant="outline"
                onClick={handleEdit}
                size="sm"
                colorScheme="blue"
              >
                수정
              </CusButton>
              <CusButton
                variant="outline"
                onClick={handleDelete}
                size="sm"
                colorScheme="red"
              >
                삭제
              </CusButton>
            </HStack>
          )}
        </Box>
        
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

    .contents {
        margin-top: 1rem;
    }

    @media (min-width: 1024px) {
        padding: 2rem 3rem;
    }
`;