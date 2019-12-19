import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import TabItemsPage from "./pages/TabItemsPage";
import AdminPage from './pages/AdminPage';

export default function App() {

  return (
      <div>
        <Router>
          <div>
            <Route path="/" component={TabItemsPage} />
            <Route path="/admin" component={AdminPage} />
          </div>
        </Router>
      </div>
  );
}