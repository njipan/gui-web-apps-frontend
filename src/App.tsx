import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import TabItemsPage from "./pages/TabItemsPage";

export default function App() {

  return (
      <div>
        <Router>
          <div>
            <Route path="/" component={TabItemsPage} />
          </div>
        </Router>
      </div>
  );
}