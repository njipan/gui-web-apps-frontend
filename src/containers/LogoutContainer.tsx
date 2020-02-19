import React from 'react';

import { AuthApi } from './../apis';
import * as Auth from './../shared/modules/auth';


let LogoutContainer = (props: any) => {
    const api = new AuthApi();

    const [isLoading, setLoading] = React.useState(true);
    React.useEffect(() => {
        Auth.forget();
        api.logout()
        .finally(() => {
            setLoading(false);
            window.location.href = '/auth/login';
        })
    }, []);

    return (
        <></>
    );
}

export default LogoutContainer;