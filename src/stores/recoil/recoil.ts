import {recoilPersist} from "recoil-persist";
import {atom, selector} from "recoil";
import {ERROR_MESSAGE, USER_DATA} from "./recoilConstants";

const {persistAtom} = recoilPersist({
  key: "sessionStorage",
  storage : sessionStorage
});

export const recoil = {
  userData : atom<UsersDTO>({
    key:`${USER_DATA}`,
    default : {
      id: "",
      userId : "",
      userPassword : "",
      email : "",
      roles : []
    },
  }),
  
  errMsg: atom<ErrorMessageProps>({
    key:`${ERROR_MESSAGE}`,
    default: {
      status : "",
      msg: "retrieve failed"
    }
  }),
}

