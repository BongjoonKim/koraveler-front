import {recoilPersist} from "recoil-persist";
import {atom} from "recoil";

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
  })
}

