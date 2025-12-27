import ProtectedRoute from "../ProtectedRoute";
import {Box, Flex, VStack} from "@chakra-ui/react";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import {Route, Routes} from "react-router-dom";
import FolderManagement from "../../component/page/menu/admin/FolderAdmin/FolderManagement";
import UserTabLayout from "../../common/layout/TabLayout/UserTabLayout";
import styled from "styled-components";

export default function UserRoutes() {
  return (
    <ProtectedRoute requiredRoles={["admin", "user"]}>
      <Flex direction="column" w="100%" h="100%">
        <MainLayout showHero={false}>
          <UserTabLayout>
            <Routes>
              <Route path={"/folder"} element={<FolderManagement />}/>
            </Routes>
          </UserTabLayout>
        </MainLayout>
      </Flex>
    </ProtectedRoute>
  )
}
const StyledAdminRoutes = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;