import {recoilPersist} from "recoil-persist";
import {atom, selector} from "recoil";
import {ERROR_MESSAGE, USER_DATA} from "./recoilConstants";
import {ErrorMessageProps} from "./types";

const {persistAtom} = recoilPersist({
  key: "sessionStorage",
  storage : sessionStorage
});

export const recoil = {
  userData : atom<UsersDTO>({
    key:`${USER_DATA}`,
    default : {
    },
  }),
  
  errMsg: atom<ErrorMessageProps>({
    key:`${ERROR_MESSAGE}`,
    default: {
      status : undefined,
      msg: "",
      isShow : false
    }
  }),
}

