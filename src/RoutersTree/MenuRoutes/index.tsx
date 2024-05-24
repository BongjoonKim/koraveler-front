import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import MenuAdminRoutes from "./MenuAdminRoutes";
import MenuTab from "../../common/layout/MenuTab";
import MenuHeader from "../../common/layout/MenuHeader";

export default function MenuRoutes() {
  return (
    <StyledMenuRoutes>
      <MenuHeader />
      <MenuTab>
        <Routes>
          <Route path="/admin/*" element={<MenuAdminRoutes />} />
        </Routes>
      </MenuTab>
    </StyledMenuRoutes>
  )
}

const StyledMenuRoutes = styled.div`
  padding: 1rem;
`;