import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/TabLayout";
import MenuHeader from "../../common/layout/MenuHeader";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";
import MenuAdmin from "../../component/page/menu/admin/MenuAdmin";
import FolderManagement from "../../component/page/menu/admin/FolderAdmin/FolderManagement";
import FeatureAdminDashboard from "../../component/page/admin/Feature/FeaturedAdminDashboard";
import ProtectedRoute from "../ProtectedRoute";

export default function AdminRoutes() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <StyledAdminRoutes>
        <AdminLayout>
          <Routes>
            <Route path="/menu" element={<MenuAdmin />} />
            <Route path="/folder" element={<FolderManagement />} />
            <Route path="/feature" element={<FeatureAdminDashboard />} />
          </Routes>
        </AdminLayout>
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