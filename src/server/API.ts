import axios from "axios"

const API = axios.create({
    // baseURL: "http://localhost:8096/api"
    baseURL: "https://backend-monev-api.setionugraha.my.id/api"
});

export default API;
// export const BASE_URL_FILE = "http://localhost:8096";
export const BASE_URL_FILE = "https://backend-monev-api.setionugraha.my.id";