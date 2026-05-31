import React from "react";
import { Box, Text, Select, Stack, Badge } from "@chakra-ui/react";
import { BookOpen, TrendingUp, Clock, Star } from "lucide-react";
import useBlogTitle from "./useBlogTitle";
import {BLOG_LIST_SORTS, BlogListSortsOptionsType} from "../../../../../constants/constants";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

function BlogTitle({ ...props }) {
  const {
    curPageTitle,
    sortOptions,
    changeSort,
    selectedOption,
    currentUser,
  } = useBlogTitle();
  const { blogListUrl } = useBlogLocale();
  
  console.log("currentUser", currentUser)
  
  return (
    <Box mb={4}>
      {/* 그라데이션 헤더 - HomePage 스타일 일관성 */}
      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        p={8}
        mb={4}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
        h={"2rem"}
      >
        <Stack direction="row" align="center" justify="space-between" h={"100%"}>
          <Stack direction="row" align="center" gap={3}>
            <Box bg="white/20" p={3} borderRadius="xl">
              <BookOpen size={16} color="white" />
            </Box>
            <Box>
              <Text
                color="white"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                {curPageTitle || "Travel Stories & Tips"}
              </Text>
            </Box>
          </Stack>
          
          {/* 정렬 옵션 */}
          <StyledSelect
            value={selectedOption || BLOG_LIST_SORTS.LATEST}
            onChange={(e) => changeSort(e.target.value)}
          >
            {sortOptions.map((option: BlogListSortsOptionsType) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </StyledSelect>
        </Stack>
      </Box>
      
      {/* 카테고리 필터 (Optional) */}
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Link className="box" to={blogListUrl('home')}>
          <Badge
            colorPalette="purple"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ transform: "scale(1.05)" }}
          >
            All Posts
          </Badge>
        </Link>
      {currentUser?.id && (
        <>
        <Link className="box" to={blogListUrl('my-blog')}>
          <Badge
            colorPalette="purple"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ transform: "scale(1.05)" }}
          >
            My Post
          </Badge>
        </Link>
        <Link className="box" to={blogListUrl('bookmark')}>
          <Badge
            colorPalette="blue"
            variant="outline"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ bg: "blue.50" }}
          >
            Bookmark
          </Badge>
        </Link>
        <Link className="box" to={blogListUrl('draft')}>
          <Badge
            colorPalette="blue"
            variant="outline"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ bg: "blue.50" }}
          >
            Draft
          </Badge>
        </Link>
        <Link className="box" to={blogListUrl('hidden')}>
          <Badge
            colorPalette="blue"
            variant="outline"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ bg: "blue.50" }}
          >
            Hidden
          </Badge>
        </Link>
        <Link className="box" to={blogListUrl('trash')}>
          <Badge
            colorPalette="red"
            variant="outline"
            size="lg"
            borderRadius="full"
            px={4}
            py={2}
            cursor="pointer"
            _hover={{ bg: "red.50" }}
          >
            Trash
          </Badge>
        </Link>
        </>
      )}
      </Stack>
    </Box>
  );
}

export default BlogTitle;

const StyledSelect = styled.select`
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 14px;
    min-width: 150px;
    cursor: pointer;
    outline: none;

    &:hover {
        border-color: #cbd5e0;
    }

    &:focus {
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }
`;