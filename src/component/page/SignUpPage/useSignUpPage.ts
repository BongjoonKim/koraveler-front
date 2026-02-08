import {SignUpPageProps} from "./SignUpPage";
import {ChangeEvent, useCallback, useState} from "react";
import {useRecoilState, useResetRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {signUp} from "../../../endpoints/login-endpoints";
import {useNavigate} from "react-router-dom";
import {UsersDTO} from "../../../types/users/UsersDTO";

type ErrValidType = {
  [K in keyof UsersDTO]: string;
};

export default function useSignUpPage(props : SignUpPageProps) {
  const [signUpForm, setSignUpForm] = useState<UsersDTO>({});
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [userErrValid, setUserErrValid] = useState<ErrValidType>({});
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const errMsgReset = useResetRecoilState(recoil.errMsg);
  const navigate = useNavigate();
  
  // Validate ID input
  const handleChangeId = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        userId : event.target.value
      }
    })
  }, [signUpForm]);
  
  const handleChangePwd = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
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
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const handleChangeEmail = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        email : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const handleChangeBirthday = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const beforeSignUpCheck = useCallback(() => {
    try {
      console.log("validation", signUpForm.userId)
      if (signUpForm.userId) {
        const regex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
        console.log("validation", regex.test(signUpForm.userId))
        if (!regex.test(signUpForm.userId)) {
          throw "ID must be at least 3 alphanumeric characters, no special characters"
        }
      } else {
        throw "Invalid ID"
      }
      if (signUpForm.userPassword) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,32}$/;
        if (!regex.test(signUpForm.userPassword)) {
          throw "Password must be 6-32 characters, including at least one uppercase letter, number, and special character"
        }
      } else {
        throw "Please enter your password"
      }
      if (checkPassword) {
        if (signUpForm.userPassword !== checkPassword) {
          throw "Passwords do not match"
        }
      } else {
        throw "Please confirm your password"
      }
      if (signUpForm.name) {
        const regex = /^\p{L}{2,}$/u;
        if (!regex.test(signUpForm.name)) {
          throw "Please enter a valid name"
        }
      } else {
        throw "Please enter your name";
      }
      if (signUpForm.email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(signUpForm.email)) {
          throw "Please enter a valid email"
        }
      } else {
        throw "Please enter your email";
      }
    } catch (e) {
      setUserErrValid(prev => ({
        userId : signUpForm.userId
      }));
      setErrMsg({
        isShow : true,
        status : "error",
        msg : e?.toString()
      })
      setTimeout(() => {
        errMsgReset();
      }, 2000);

    }
  }, [signUpForm, checkPassword]);
  
  const handleSignUp = useCallback(async () => {
    
    try {
      // Run validation checks
      beforeSignUpCheck();
      const res = await signUp(signUpForm);
      console.log("res.data", res)
      navigate('/login')
    } catch (e : any) {
      console.log("res.data", e)
      setErrMsg({
        isShow : true,
        status : "error",
        msg : e.response?.data.toString()
      })
      setTimeout(() => {
        errMsgReset();
      }, 2000);
    }
  }, [signUpForm, beforeSignUpCheck]);
  
  return {
    signUpForm,
    checkPassword,
    errMsg,
    handleChangeId,
    handleChangePwd,
    handleChangePwdCheck,
    handleSignUp,
    handleChangeName,
    handleChangeEmail,
  }
}
