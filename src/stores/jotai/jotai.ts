import { atom } from 'jotai'
import {getUserData} from "../../endpoints/users-endpoints";

export const jAccessToken = atom<string | undefined>("");

export const jUserData = atom<UsersDTO>(async get => {
  const resUserData = await getUserData();
})