import axios from "axios";
import { useDispatch } from "react-redux";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})

let refresh = false;

api.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        console.log(localStorage.getItem('refresh'))
        const response = await
            api.post('token/refresh', {
                refresh: localStorage.getItem('refresh')
            },
                {
                    headers:
                        { 'Content-Type': 'application/json' }
                }
                , { withCredentials: true });
            console.log('refresh',response);
        if (response.status === 200) {
            api.defaults.headers.common['Authorization'] = `Bearer 
            ${response.data['access']}`;
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            window.location.href='/'
            return api(error.config);
        }
    }
    refresh = false;
    return error;
});


export default api