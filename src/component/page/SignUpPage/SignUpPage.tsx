// src/component/page/SignUpPage/SignUpPage.tsx

import {
  Box,
  Separator,
  VStack,
  Heading,
  Container,
  Alert
} from "@chakra-ui/react";
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
    <Container maxW="md" py={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={6} align="stretch">
          {errMsg?.isShow && (
            <Alert.Root status={errMsg.status as "error" | "warning" | "success" | "info"}>
              <Alert.Indicator />
              <Alert.Title>{errMsg.msg}</Alert.Title>
            </Alert.Root>
          )}
          
          <Box textAlign="center">
            <Heading size="2xl" color="gray.700">
              Sign Up
            </Heading>
          </Box>
          
          <VStack gap={4} align="stretch">
            {/* ID */}
            <CusFormCtrl
              formTitle="ID"
              errMsg={getErrorMessage(errors.userId)}
              isInValid={!!errors.userId}
            >
              <CusInput
                {...register("userId", {
                  required: "Please enter your ID",
                  onChange: handleChangeId
                })}
                placeholder="Enter your ID"
              />
            </CusFormCtrl>
            
            {/* Password */}
            <CusFormCtrl
              formTitle="Password"
              errMsg={getErrorMessage(errors.userPassword)}
              isInValid={!!errors.userPassword}
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
              />
            </CusFormCtrl>
            
            {/* Password Confirmation */}
            <CusFormCtrl
              formTitle="Password Check"
              errMsg={getErrorMessage(errors.passwordCheck)}
              isInValid={!!errors.passwordCheck}
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
              />
            </CusFormCtrl>
            
            <Separator />
            
            {/* Name */}
            <CusFormCtrl
              formTitle="Name"
              errMsg={getErrorMessage(errors.name)}
              isInValid={!!errors.name}
            >
              <CusInput
                {...register("name", {
                  required: "Please enter your name",
                  onChange: handleChangeName
                })}
                placeholder="Enter your name"
              />
            </CusFormCtrl>
            
            {/* Email */}
            <CusFormCtrl
              formTitle="Email"
              errMsg={getErrorMessage(errors.email)}
              isInValid={!!errors.email}
            >
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
              />
            </CusFormCtrl>
          </VStack>
          
          <Box pt={4}>
            <CusButton
              type="submit"
              size="lg"
              width="100%"
              colorPalette="blue"
              variant="solid"
            >
              Sign Up
            </CusButton>
          </Box>
        </VStack>
      </form>
    </Container>
  );
}

export default SignUpPage;