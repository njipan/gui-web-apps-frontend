import Axios, { AxiosError } from "axios";
import Swal from 'sweetalert2';

const axios = Axios.create({
    baseURL : process.env.REACT_APP_API_URL,
});

export default axios;
