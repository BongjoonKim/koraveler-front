import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import LoginPage from "../../component/page/LoginPage";
import SignUpPage from "../../component/page/SignUpPage";

interface LoginRoutesProps {}

function LoginRoutes() {
  return (
    <StyledLoginRoutes>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </StyledLoginRoutes>
  )
}

export default LoginRoutes;

const StyledLoginRoutes = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;