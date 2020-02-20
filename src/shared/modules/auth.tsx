

export function set(data: any){
    return window.localStorage.setItem('auth', btoa(JSON.stringify(data)));
}

export function get(){
    const value = window.localStorage.getItem('auth') || 'null';
    return JSON.parse(atob(value)); 
}

export function check(){
    return window.localStorage.getItem('auth') !== null;
}

export function forget(){
    return window.localStorage.clear();
}

export function setToken(token: any){
    return window.localStorage.setItem('token', token);
}

export function getToken(){
    return window.localStorage.getItem('token');
}