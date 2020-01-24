import axios from './../shared/modules/axios';
import { AxiosInstance } from 'axios';

export default abstract class Api {
    request: AxiosInstance;

    constructor(){
        this.request = axios;
    }
}