import styled from "styled-components";
import CusInput from "../../../common/elements/textField/CusInput";
import useLoginPage from "./useLoginPage";
import CusButton from "../../../common/elements/buttons/CusButton";

interface LoginPageProps {

};

function LoginPage(props: LoginPageProps) {
  const {
    userInfo,
    handleClickTitle
  } = useLoginPage();
  return (
    <StyledLoginPage>
      <div
        className="title"
        onClick={handleClickTitle}
      >
        Koraveler
      </div>
      <CusInput
        placeholder="ID"
        value={userInfo.userId}
      />
      <CusInput
        placeholder="PASSWORD"
        value={userInfo.userPassword}
      />
      <CusButton>
        login
      </CusButton>
    </StyledLoginPage>
  )
};

export default LoginPage;

const StyledLoginPage = styled.div`

`;
