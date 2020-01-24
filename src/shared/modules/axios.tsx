import Axios, { AxiosError } from "axios";
import Swal from 'sweetalert2';

const axios = Axios.create({
    baseURL : "http://localhost:8000/api"
});

export default axios;
