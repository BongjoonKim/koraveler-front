import styled from "styled-components";
import CusInput from "../../../common/elements/textField/CusInput";
import useLoginPage from "./useLoginPage";
import CusButton from "../../../common/elements/buttons/CusButton";
import { ChangeEvent } from "react";
import { Alert } from "@chakra-ui/react";

interface LoginPageProps {

};

// 다크 카드 위 입력 필드 — 흰 글자/은은한 보더로 가독성 확보 (body 배경은 항상 다크)
const darkInputProps = {
  bg: "rgba(255, 255, 255, 0.04)",
  borderColor: "rgba(255, 255, 255, 0.16)",
  color: "rgba(255, 255, 255, 0.95)",
  _placeholder: { color: "rgba(255, 255, 255, 0.35)" },
  _focus: {
    borderColor: "rgba(143, 191, 148, 0.6)",
    boxShadow: "0 0 0 3px rgba(143, 191, 148, 0.14)",
  },
  css: {
    colorScheme: "dark" as const,
    caretColor: "rgba(255, 255, 255, 0.95)",
  },
};

function LoginPage(props: LoginPageProps) {
  const {
    userInfo,
    errMsg,
    handleChange,
    handleClickTitle,
    handleClickLogin,
    handleClickSignUp,
    pressEnter,
  } = useLoginPage();

  return (
    <PageWrapper>
      <Card>
        {errMsg?.isShow && (
          <Alert.Root status={errMsg.status as "error" | "warning" | "success" | "info"}>
            <Alert.Indicator />
            <Alert.Title>{errMsg.msg}</Alert.Title>
          </Alert.Root>
        )}

        <Header>
          <Title onClick={handleClickTitle}>nadeliv</Title>
        </Header>

        <Form>
          <CusInput
            placeholder="ID"
            value={userInfo.userId}
            id="id"
            name="id"
            type="text"
            size="lg"
            onKeyUp={pressEnter}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "id")}
            {...darkInputProps}
          />
          <CusInput
            placeholder="PASSWORD"
            value={userInfo.userPassword}
            type="password"
            id="pw"
            name="pw"
            size="lg"
            onKeyUp={pressEnter}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "password")}
            {...darkInputProps}
            toggleProps={{
              color: "rgba(255, 255, 255, 0.65)",
              _hover: { color: "rgba(255, 255, 255, 0.9)", bg: "rgba(255, 255, 255, 0.08)" },
            }}
          />
        </Form>

        <Actions>
          <CusButton
            onClick={handleClickLogin}
            size="lg"
            w="full"
            bg="rgba(255, 255, 255, 0.95)"
            color="rgba(15, 15, 20, 0.95)"
            fontWeight="600"
            letterSpacing="0.02em"
            _hover={{ bg: "rgba(255, 255, 255, 1)" }}
            _active={{ bg: "rgba(235, 235, 240, 1)" }}
          >
            Login
          </CusButton>
          <CusButton
            onClick={handleClickSignUp}
            variant="outline"
            size="lg"
            w="full"
            bg="transparent"
            color="rgba(255, 255, 255, 0.9)"
            borderColor="rgba(255, 255, 255, 0.2)"
            fontWeight="500"
            letterSpacing="0.02em"
            _hover={{ bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.4)" }}
            _active={{ bg: "rgba(255, 255, 255, 0.08)" }}
          >
            Sign Up
          </CusButton>
        </Actions>
      </Card>
    </PageWrapper>
  )
};

export default LoginPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.05), transparent 55%),
    radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.03), transparent 55%);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
`;

const Title = styled.span`
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 500;
  font-size: 3.5rem;
  line-height: 1.1;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.95);
  width: fit-content;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
