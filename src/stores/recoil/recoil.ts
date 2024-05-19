import {recoilPersist} from "recoil-persist";
import {atom, selector} from "recoil";
import {ALERT_MESSAGE, USER_DATA} from "./recoilConstants";

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
    effects_UNSTABLE: [persistAtom]
  }),
  
  alertMsg: atom<AlertMsg>({
    key:`${ALERT_MESSAGE}`,
    default: {}
  }),
}

