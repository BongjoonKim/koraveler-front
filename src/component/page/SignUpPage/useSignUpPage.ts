import {SignUpPageProps} from "./SignUpPage";
import {ChangeEvent, useCallback, useState} from "react";

type UsersState = {
  [K in keyof UsersDTO]: string;
};

export default function useSignUpPage(props : SignUpPageProps) {
  const [signUpForm, setSignUpForm] = useState<UsersDTO>({});
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [userErrValid, setUserErrValid] = useState<UsersState>({});
  
  // 아이디 확인하기
  const handleChangeId = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    console.log("event", event.target.value)
    setSignUpForm(prev => {
      return {
        ...prev,
        userId : event.target.value
      }
    })
  }, [signUpForm]);
  
  const handleChangePwd = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm(prev => {
      return {
        ...prev,
        userPassword : event.target.value
      }
    })
  }, [signUpForm]);
  
  const handleChangePwdCheck = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value)
  }, [signUpForm, checkPassword]);
  
  const handleChangeName = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm(prev => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const handleChangeEmail = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm(prev => {
      return {
        ...prev,
        email : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const handleChangeBirthday = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm(prev => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const handleSignUp = useCallback(async () => {
  
  }, [signUpForm]);
  
  return {
    signUpForm,
    checkPassword,
  
    handleChangeId,
    handleChangePwd,
    handleChangePwdCheck,
    handleSignUp,
    handleChangeName,
    handleChangeEmail,
  }
}
