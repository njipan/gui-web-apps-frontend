import React from 'react';
import { Route, BrowserRouter as Router, Link, Redirect } from 'react-router-dom';

import LoginContainer from './../../containers/temp/LoginContainer';
import RegisterContainer from './../../containers/temp/RegisterContainer';

let AuthPage = (props: any) => {
    return (
        <>
            <Router>
                <Route exact path={props.match.path + '/login'} component={LoginContainer} />
                <Route exact path={props.match.path + '/register'} component={RegisterContainer} />
            </Router>
        </>
    );
}

export default AuthPage;