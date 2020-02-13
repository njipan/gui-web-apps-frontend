import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import TabItemsPage from "./pages/TabItemsPage";
import { AdminPage, QuizPage, AuthPage } from './pages';

export default function App() {

  return (
      <div>
        <Router>
            <Route path="/auth" component={AuthPage} />
            <Route path="/quizzes/:id" component={QuizPage} exact />
            <Route path="/admin" component={AdminPage}/>
            <Route path="/" component={TabItemsPage} exact />
        </Router>
      </div>
  );
}