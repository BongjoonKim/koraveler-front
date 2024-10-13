import axios from "axios";

// Spring Security 필요
export const request = axios.create({
  withCredentials: true,
  baseURL: `${process.env["REACT_APP_BACKEND_URI"]}`,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    'Access-Control-Allow-Credentials' : true,
    "Content-Type": `application/json;charset=UTF-8`,
  }
});

// 로그인 전용 axios
export const securityReq = axios.create({
  withCredentials: true,
  baseURL:`${process.env["REACT_APP_BACKEND_URI"]}`,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    'Access-Control-Allow-Credentials' : true,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

