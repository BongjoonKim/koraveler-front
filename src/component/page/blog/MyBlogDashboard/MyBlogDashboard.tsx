import { Box, Container } from "@chakra-ui/react";
import useMyBlogDashboard from "./useMyBlogDashboard";
import DashboardHeader from "./components/DashboardHeader";
import StatCards from "./components/StatCards";
import FilterTabs from "./components/FilterTabs";
import PostListTable from "./components/PostListTable";

export interface MyBlogDashboardProps {}

function MyBlogDashboard(_props: MyBlogDashboardProps) {
  const {
    userName,
    summary,
    stats,
    posts,
    counts,
    activeTab,
    setActiveTab,
    sortKey,
    setSortKey,
  } = useMyBlogDashboard();

  // 탭 별 fetch 는 hook 안에서 처리되므로 여기서는 들어온 posts 그대로 보여준다.
  return (
    <Box paddingY={"2.5rem"} bg={"#0a0a0a"} minH={"100vh"} color={"white"}>
      <Container maxW={"6xl"} px={{ base: 4, md: 6, lg: 8 }}>
        <DashboardHeader userName={userName} summary={summary} />
        <StatCards stats={stats} />
        <FilterTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
        <PostListTable posts={posts} />
      </Container>
    </Box>
  );
}

export default MyBlogDashboard;
