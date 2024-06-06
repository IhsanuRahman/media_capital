import axios, { Axios } from "axios";
import { baseUrl } from "./constants";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})


api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          try {
            const response = await axios.post(`${baseUrl}/token/refresh`, {
                refresh: localStorage.getItem('refresh')
            });
            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;
            console.log('tok',newAccessToken)
            localStorage.setItem('access', newAccessToken);  
            localStorage.setItem('refresh', newRefreshToken);  
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (error) {
            console.log('eerr',error)
        
          }
        }
      }
      return Promise.reject(error);
    }
  );

export default api