import { Route, Routes } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import ProtectedRoute from "../ProtectedRoute";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import ProfilePage from "../../component/page/profile/ProfilePage";

export default function ProfileRoutes() {
  return (
    <ProtectedRoute requiredRoles={["admin", "user"]}>
      <Flex direction="column" w="100%" h="100%">
        <MainLayout showHero={false}>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
          </Routes>
        </MainLayout>
      </Flex>
    </ProtectedRoute>
  );
}
