// src/component/page/SignUpPage/SignUpPage.tsx

import styled from "styled-components";
import { Alert, Box, HStack, Text } from "@chakra-ui/react";
import CusInput from "../../../common/elements/textField/CusInput";
import useSignUpPage from "./useSignUpPage";
import CusFormCtrl from "../../../common/elements/CusFormCtrl";
import { useForm, FieldError } from "react-hook-form";
import CusButton from "../../../common/elements/buttons/CusButton";

export interface SignUpPageProps {

}

// Form data types for react-hook-form
interface SignUpFormData {
  userId: string;
  userPassword: string;
  passwordCheck: string;
  name: string;
  email: string;
}

// 다크 카드 위 입력 필드 — 흰 글자/은은한 보더로 가독성 확보 (LoginPage 와 동일 스타일)
const darkInputProps = {
  bg: "rgba(255, 255, 255, 0.04)",
  borderColor: "rgba(255, 255, 255, 0.16)",
  color: "rgba(255, 255, 255, 0.95)",
  _placeholder: { color: "rgba(255, 255, 255, 0.35)" },
  _focus: {
    borderColor: "rgba(143, 191, 148, 0.6)",
    boxShadow: "0 0 0 3px rgba(143, 191, 148, 0.14)",
  },
  _disabled: { opacity: 0.55 },
  css: {
    colorScheme: "dark" as const,
    caretColor: "rgba(255, 255, 255, 0.95)",
  },
};

const passwordToggleProps = {
  color: "rgba(255, 255, 255, 0.65)",
  _hover: { color: "rgba(255, 255, 255, 0.9)", bg: "rgba(255, 255, 255, 0.08)" },
};

// 다크 카드 위 라벨
const darkLabelProps = {
  color: "rgba(255, 255, 255, 0.7)",
  fontWeight: "500",
  letterSpacing: "0.02em",
};

function SignUpPage(props: SignUpPageProps) {
  const {
    signUpForm,
    checkPassword,
    errMsg,
    handleChangeId,
    handleChangePwd,
    handleChangePwdCheck,
    handleChangeName,
    handleChangeEmail,
    handleSignUp,
    // 이메일 인증
    emailVerified,
    codeSent,
    verificationCode,
    cooldown,
    handleSendCode,
    handleVerifyCode,
    handleChangeCode,
    sendCodeLoading,
    verifyCodeLoading,
    // 뒤로가기
    handleBack,
  } = useSignUpPage(props);

  const { register, watch, formState: { errors }, handleSubmit } = useForm<SignUpFormData>({
    mode: 'onBlur',
    defaultValues: {
      userId: signUpForm.userId || '',
      userPassword: signUpForm.userPassword || '',
      passwordCheck: checkPassword || '',
      name: signUpForm.name || '',
      email: signUpForm.email || ''
    }
  });

  // Extract error message string from FieldError
  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };

  // Form submission handler
  const onSubmit = (data: SignUpFormData) => {
    handleSignUp();
  };

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
          <Title onClick={handleBack}>nadeliv</Title>
          <Subtitle>Create your account</Subtitle>
        </Header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Fields>
            {/* ID */}
            <CusFormCtrl
              formTitle="ID"
              errMsg={getErrorMessage(errors.userId)}
              isInValid={!!errors.userId}
              labelProps={darkLabelProps}
            >
              <CusInput
                {...register("userId", {
                  required: "Please enter your ID",
                  onChange: handleChangeId
                })}
                placeholder="Enter your ID"
                size="lg"
                {...darkInputProps}
              />
            </CusFormCtrl>

            {/* Password */}
            <CusFormCtrl
              formTitle="Password"
              errMsg={getErrorMessage(errors.userPassword)}
              isInValid={!!errors.userPassword}
              labelProps={darkLabelProps}
            >
              <CusInput
                {...register("userPassword", {
                  required: "Please enter your password",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  },
                  onChange: handleChangePwd
                })}
                type="password"
                placeholder="Enter your password"
                size="lg"
                {...darkInputProps}
                toggleProps={passwordToggleProps}
              />
            </CusFormCtrl>

            {/* Password Confirmation */}
            <CusFormCtrl
              formTitle="Password Check"
              errMsg={getErrorMessage(errors.passwordCheck)}
              isInValid={!!errors.passwordCheck}
              labelProps={darkLabelProps}
            >
              <CusInput
                {...register("passwordCheck", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("userPassword") || "Passwords do not match",
                  onChange: handleChangePwdCheck
                })}
                type="password"
                placeholder="Re-enter your password"
                size="lg"
                {...darkInputProps}
                toggleProps={passwordToggleProps}
              />
            </CusFormCtrl>

            <Divider />

            {/* Name */}
            <CusFormCtrl
              formTitle="Name"
              errMsg={getErrorMessage(errors.name)}
              isInValid={!!errors.name}
              labelProps={darkLabelProps}
            >
              <CusInput
                {...register("name", {
                  required: "Please enter your name",
                  onChange: handleChangeName
                })}
                placeholder="Enter your name"
                size="lg"
                {...darkInputProps}
              />
            </CusFormCtrl>

            {/* Email + 인증 */}
            <CusFormCtrl
              formTitle={emailVerified ? "Email (Verified)" : "Email"}
              errMsg={getErrorMessage(errors.email)}
              isInValid={!!errors.email}
              labelProps={darkLabelProps}
            >
              <HStack gap={2} w={'full'}>
                <Box flex={1}>
                  <CusInput
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email"
                      },
                      onChange: handleChangeEmail
                    })}
                    type="email"
                    placeholder="Enter your email"
                    size="lg"
                    disabled={emailVerified}
                    {...darkInputProps}
                  />
                </Box>
                <CusButton
                  type="button"
                  size="lg"
                  onClick={handleSendCode}
                  disabled={emailVerified || cooldown > 0 || sendCodeLoading}
                  flexShrink={0}
                  variant="outline"
                  bg="transparent"
                  color={emailVerified ? "rgba(143, 191, 148, 0.95)" : "rgba(255, 255, 255, 0.9)"}
                  borderColor={emailVerified ? "rgba(143, 191, 148, 0.5)" : "rgba(255, 255, 255, 0.2)"}
                  fontWeight="500"
                  whiteSpace="nowrap"
                  _hover={{ bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.4)" }}
                >
                  {emailVerified
                    ? "Verified"
                    : cooldown > 0
                      ? `Resend (${cooldown}s)`
                      : codeSent
                        ? "Resend"
                        : "Send Code"
                  }
                </CusButton>
              </HStack>
            </CusFormCtrl>

            {/* 인증 코드 입력 (발송 후, 인증 전) */}
            {codeSent && !emailVerified && (
              <CusFormCtrl formTitle="Verification Code" labelProps={darkLabelProps}>
                <HStack gap={2}>
                  <Box flex={1}>
                    <CusInput
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={handleChangeCode}
                      maxLength={6}
                      size="lg"
                      {...darkInputProps}
                    />
                  </Box>
                  <CusButton
                    type="button"
                    size="lg"
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || verifyCodeLoading}
                    flexShrink={0}
                    bg="rgba(255, 255, 255, 0.95)"
                    color="rgba(15, 15, 20, 0.95)"
                    fontWeight="600"
                    whiteSpace="nowrap"
                    _hover={{ bg: "rgba(255, 255, 255, 1)" }}
                    _active={{ bg: "rgba(235, 235, 240, 1)" }}
                  >
                    {verifyCodeLoading ? "Verifying..." : "Verify"}
                  </CusButton>
                </HStack>
                <Text fontSize="xs" color="rgba(255, 255, 255, 0.45)" mt={1}>
                  The code expires in 5 minutes
                </Text>
              </CusFormCtrl>
            )}

            <Actions>
              <CusButton
                type="submit"
                size="lg"
                w="full"
                disabled={!emailVerified}
                bg="rgba(255, 255, 255, 0.95)"
                color="rgba(15, 15, 20, 0.95)"
                fontWeight="600"
                letterSpacing="0.02em"
                _hover={{ bg: "rgba(255, 255, 255, 1)" }}
                _active={{ bg: "rgba(235, 235, 240, 1)" }}
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              >
                Sign Up
              </CusButton>
              <CusButton
                type="button"
                variant="outline"
                size="lg"
                w="full"
                onClick={handleBack}
                bg="transparent"
                color="rgba(255, 255, 255, 0.9)"
                borderColor="rgba(255, 255, 255, 0.2)"
                fontWeight="500"
                letterSpacing="0.02em"
                _hover={{ bg: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.4)" }}
                _active={{ bg: "rgba(255, 255, 255, 0.08)" }}
              >
                Back
              </CusButton>
            </Actions>
          </Fields>
        </form>
      </Card>
    </PageWrapper>
  );
}

export default SignUpPage;

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

const Subtitle = styled.span`
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0.25rem 0;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;
