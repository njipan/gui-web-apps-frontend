
import Axios, { AxiosInstance } from "axios";

export default abstract class Api {
    request: AxiosInstance;

    constructor(){
        this.request = Axios.create({
            baseURL : "http://localhost:8000/api"
        });
    }
}