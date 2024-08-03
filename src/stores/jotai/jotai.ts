import { atom } from 'jotai'
import {getUserData} from "../../endpoints/users-endpoints";
import {errorLogs} from "../../error/errorLog";

// 로그인한 사용자 정보를 가지고 있음
export const LoginUser = atom<UsersDTO | null | undefined>({});

export const uploadedInfo = atom<any[]>([])