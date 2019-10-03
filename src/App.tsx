import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import TabItemsPage from "./pages/TabItemsPage";
import ManagePage from './pages/ManagePage';

export default function App() {

  return (
      <div>
        <Router>
          <div>
            <Route exact path="/" component={TabItemsPage} />
            <Route path="/manage" component={ManagePage} />
          </div>
        </Router>
      </div>
  );
}