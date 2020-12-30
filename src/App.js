import React from 'react';
import 'bulma/css/bulma.min.css'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'
import './css/App.css'
import './css/BulmaDarkly.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Main from './pages/Main';

function App() {
  return (
    <div className="App">
      <Router>

        <Switch>
          <Route path="/:userID" component={Main}/>
          <Redirect path="/" to="/Cranki220"/>
        </Switch>

      </Router>
    </div>
  );
}

export default App;
