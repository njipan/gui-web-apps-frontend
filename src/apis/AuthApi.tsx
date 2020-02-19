import Api from './Api';

export default class AuthApi extends Api{

    constructor(){
        super();
    }

    register(data: any) {
        return this.request.post(`auth/register`, data);
    }

    login(username: string, password: string) {
        return this.request.post(`auth/login`, {
            username,
            password : btoa(password)
        });
    }

    logout() {
        return this.request.post(`auth/logout`);
    }
}