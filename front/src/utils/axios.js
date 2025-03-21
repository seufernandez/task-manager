/* eslint-disable no-undef */
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  headers: {Accept: 'application/json'}
});

api.interceptors.request.use(
  (config) => {
    const jwtToken = obterTokenJWT();

    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function obterTokenJWT() {
  const jwtToken = localStorage.getItem('access_token');
  return jwtToken;
}
