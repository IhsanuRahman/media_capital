import axios, { Axios } from "axios";
import { baseUrl } from "./constants";
import { checkAuth } from "./features/user";
import { useDispatch } from "react-redux";


const api = axios.create({
    baseURL: baseUrl,
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
            },{ headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }})
            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;
            localStorage.setItem('access', newAccessToken);   
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            return axios(originalRequest);
          } catch (error) {
            return Promise.reject(error)
            
          }
        }
      }
      return Promise.reject(error);
    }
  );

export default api