import React from "react";
import { Box, Container, Text, Stack } from "@chakra-ui/react";
import { UserCog } from "lucide-react";
import CusTab from "../../../common/elements/CusTab";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import PasswordChange from "./PasswordChange/PasswordChange";
import AccountDelete from "./AccountDelete/AccountDelete";
import useProfilePage from "./useProfilePage";

export default function ProfilePage() {
  const { tabs } = useProfilePage();

  const tabsWithContent = tabs.map((tab) => ({
    ...tab,
    content:
      tab.value === "profile" ? <ProfileInfo /> :
      tab.value === "password" ? <PasswordChange /> :
      tab.value === "account" ? <AccountDelete /> :
      null,
  }));

  return (
    <Box pb="2rem">
      <Container maxW="3xl" px={{ base: 4, sm: 4, lg: 4 }} pt={6}>
        {/* 페이지 헤더 */}
        <Box
          borderRadius="2xl"
          overflow="hidden"
          p={8}
          mb={6}
          h="2rem"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          }}
        >
          <Stack direction="row" align="center" h="100%" gap={3}>
            <Box bg="white/20" p={3} borderRadius="xl">
              <UserCog size={16} color="white" />
            </Box>
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              My Profile
            </Text>
          </Stack>
        </Box>

        {/* 탭 콘텐츠 */}
        <CusTab
          tabs={tabsWithContent}
          defaultValue="profile"
          variant="line"
          colorPalette="purple"
        />
      </Container>
    </Box>
  );
}
