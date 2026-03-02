import axios from "axios"

const API = axios.create({
    baseURL: "api"
});

export default API;
export const BASE_URL_FILE = "";