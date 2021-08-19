import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { config } from "./app/Config";
import Login from "./app/Pages/Login";
import Register from "./app/Pages/Register";
import Recovery from "./app/Pages/Recovery";
import Registerok from "./app/Pages/Registerok";
import Confirmed from "./app/Pages/Confirmed";
import Home from "./app/Pages/Home";

export default function App() {
  console.log(config.endpoint);

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/recovery">
            <Recovery />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/registerok">
            <Registerok />
          </Route>
          <Route path="/confirmed">
            <Confirmed />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
