import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";

export default function MenuRoutes() {
  return (
    <StyledMenuRoutes>
      <Routes>
        <Route path="/admin/*" element={<MenuAdminRoutes />} />
      </Routes>
    </StyledMenuRoutes>
  )
}

const StyledMenuRoutes = styled.div`
`;