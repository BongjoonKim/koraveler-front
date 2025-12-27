import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/TabLayout";
import MenuHeader from "../../common/layout/MenuHeader";
import MenuAdmin from "../../component/page/menu/admin/MenuAdmin";
import FolderManagement from "../../component/page/menu/admin/FolderAdmin/FolderManagement";
import FeatureAdminDashboard from "../../component/page/admin/Feature/FeaturedAdminDashboard";
import ProtectedRoute from "../ProtectedRoute";
import MainLayout from "../../common/layout/MainLayout/MainLayout";
import AdminTabLayout from "../../common/layout/TabLayout";

export default function AdminRoutes() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <StyledAdminRoutes>
        <MainLayout showHero={false}>
          <AdminTabLayout>
            <Routes>
              <Route path="/menu" element={<MenuAdmin />} />
              <Route path="/folder" element={<FolderManagement />} />
              <Route path="/feature" element={<FeatureAdminDashboard />} />
            </Routes>
          </AdminTabLayout>
        </MainLayout>
      </StyledAdminRoutes>
    </ProtectedRoute>
  )
}

const StyledAdminRoutes = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;