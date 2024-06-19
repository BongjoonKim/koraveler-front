import { atom } from 'jotai'
import {getUserData} from "../../endpoints/users-endpoints";
import {errorLogs} from "../../error/errorLog";

export const AccessToken = atom<string | undefined>("");