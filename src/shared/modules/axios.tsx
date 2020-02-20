import Axios, { AxiosError } from "axios";
import * as Auth from './auth';
import Swal from 'sweetalert2';

const axios = Axios.create({
    baseURL : process.env.REACT_APP_API_URL,
});

axios.interceptors.request.use(
    (config: any) => {
        if(Auth.getToken() !== null){
            config.headers.Authorization = `${ Auth.getToken() }`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

axios.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error) => {

        if(error.response.status === 401){
            Auth.forget();
            window.location.href  = '/auth/login';
        }
        else if(error.response.status === 403){
            window.location.href  = '/auth/login';
        }

        return Promise.reject(error);
    }
)


export default axios;
