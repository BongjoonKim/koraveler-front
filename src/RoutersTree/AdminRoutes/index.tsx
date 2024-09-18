import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/TabLayout";
import MenuHeader from "../../common/layout/MenuHeader";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";
import MenuAdmin from "../../component/page/menu/admin/MenuAdmin";

export default function AdminRoutes() {
  return (
    <StyledAdminRoutes>
      <AdminLayout>
        <Routes>
          <Route path="/menu" element={<MenuAdmin />} />
        </Routes>
      </AdminLayout>
    </StyledAdminRoutes>
  )
}

const StyledAdminRoutes = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;