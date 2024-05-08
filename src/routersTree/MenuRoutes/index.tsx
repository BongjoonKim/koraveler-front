import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/MenuTab";

export default function MenuRoutes() {
  return (
    <StyledMenuRoutes>
      <MenuTab>
        <Routes>
          <Route path="/admin/*" element={<MenuAdminRoutes />} />
        </Routes>
      </MenuTab>
    </StyledMenuRoutes>
  )
}

const StyledMenuRoutes = styled.div`
`;