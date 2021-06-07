import axios from "axios";

const API_PROXY = "http://localhost:80";

// 기본 url 지정하여 반환
const request = axios.create({ baseURL: API_PROXY });
export default request;