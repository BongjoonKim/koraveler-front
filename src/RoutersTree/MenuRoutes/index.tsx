import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/TabLayout";
import MenuHeader from "../../common/layout/MenuHeader";
import AdminLayout from "../../common/layout/AdminLayout/AdminLayout";

export default function MenuRoutes() {
  return (
    <StyledMenuRoutes>
      <AdminLayout>
        <Routes>
          <Route path="/admin/*" element={<MenuAdminRoutes />} />
        </Routes>
      </AdminLayout>
    </StyledMenuRoutes>
  )
}

const StyledMenuRoutes = styled.div`
  padding: 1rem;
`;