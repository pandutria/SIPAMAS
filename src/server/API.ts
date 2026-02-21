import axios from "axios"

const API = axios.create({
    baseURL: "http://100.100.181.124:8081/api"
});

export default API;
export const BASE_URL_FILE = "http://100.100.181.124:8081";