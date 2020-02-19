import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import TabItemsPage from "./pages/TabItemsPage";
import { AdminPage, QuizPage, AuthPage } from './pages';
import { SpecificRoleRoute } from './components/Route';


export default function App() {

  return (
      <div>
        <Router>
          <Switch>
            <SpecificRoleRoute path="/admin" component={AdminPage} role="admin"/>
            <Route path="/auth" component={AuthPage} />
            <SpecificRoleRoute path="/quizzes/:id" component={QuizPage} exact role="student"/>
            <SpecificRoleRoute path="/" component={TabItemsPage} role="student"/>  
          </Switch>
        </Router>
      </div>
  );
}