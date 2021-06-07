import axios from "axios";

const API_PROXY = "사용할_BaseURL";

// 기본 url 지정하여 반환
const request = axios.create({ baseURL: API_PROXY });
export default request;