import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import MenuAdminRoutes from "../MenuRoutes/MenuAdminRoutes";
import LoginPage from "../../component/page/LoginPage";

interface LoginRoutesProps {

};

function LoginRoutes(props: LoginRoutesProps) {
  
  return (
    <StyledLoginRoutes>
      <Routes>
          <Route path="/" element={<LoginPage />} />
      </Routes>
    </StyledLoginRoutes>
  )
};

export default LoginRoutes;

const StyledLoginRoutes = styled.div`

`;
