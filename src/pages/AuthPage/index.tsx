import React from 'react';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';

import LoginContainer from './../../containers/LoginContainer';
import RegisterContainer from './../../containers/RegisterContainer';
import LogoutContainer from '../../containers/LogoutContainer';

let AuthPage = (props: any) => {
    return (
        <>
            <Route exact path={props.match.path + '/login'} component={LoginContainer} />
            <Route exact path={props.match.path + '/register'} component={RegisterContainer} />
            <Route exact path={props.match.path + '/logout'} component={LogoutContainer} />
        </>
    );
}

export default AuthPage;