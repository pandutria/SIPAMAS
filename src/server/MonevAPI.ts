import axios from "axios";
import API from "./API";

const MONEV_API = axios.create({
  baseURL: "https://malutprov.lpse.info/api2/v1"
});

const refreshToken = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/malut/token", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const base64Token = res.data.access_token;
  localStorage.setItem("access_token", base64Token);
  return base64Token;
};

MONEV_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

MONEV_API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;

      return MONEV_API.request(error.config);
    }

    return Promise.reject(error);
  }
);

export default MONEV_API;
