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
      userpassword : "",
      email : "",
      roles : []
    },
    effects_UNSTABLE: [persistAtom]
  }),
  
  alertMsg: atom<AlertMsg>({
    key:`${ALERT_MESSAGE}`,
    default: {}
  }),
  
  // recoilSelector
  userInfo : selector<any>({
    key : "sdfsdf",
    get: ({get}) => {
      let data = null;
      if (recoil.alertMsg) {
        data = get(recoil.userData)
      } else {
        data = undefined;
      }
      
      return data;
    }
  })
}

