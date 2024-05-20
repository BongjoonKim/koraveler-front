import axios from "axios";

const request = axios.create({
  baseURL: "",
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    // 'Access-Control-Allow-Credentials' : false,
    "Content-Type": `application/json;charset=UTF-8`,
  }
});

export default request