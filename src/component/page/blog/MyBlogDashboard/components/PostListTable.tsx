import { Box, Text } from "@chakra-ui/react";
import PostListRow from "./PostListRow";
import type { DashboardPost } from "../useMyBlogDashboard";

interface PostListTableProps {
  posts: DashboardPost[];
}

function PostListTable({ posts }: PostListTableProps) {
  if (posts.length === 0) {
    return (
      <Box
        bg={"rgba(255,255,255,0.03)"}
        border={"0.5px solid"}
        borderColor={"rgba(255,255,255,0.08)"}
        borderRadius={"lg"}
        padding={"3rem"}
        textAlign={"center"}
      >
        <Text fontSize={"13px"} color={"rgba(255,255,255,0.45)"}>
          No items to show yet.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={"rgba(255,255,255,0.03)"}
      border={"0.5px solid"}
      borderColor={"rgba(255,255,255,0.08)"}
      borderRadius={"lg"}
      overflow={"hidden"}
    >
      {posts.map((post, idx) => (
        <PostListRow key={post.id} post={post} isLast={idx === posts.length - 1} />
      ))}
    </Box>
  );
}

export default PostListTable;
