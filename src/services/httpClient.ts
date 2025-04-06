import axios from "axios";
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  
});

httpClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
