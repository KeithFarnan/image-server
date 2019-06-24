import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {
  Route,
  NavLink,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Login from "./Components/Pages/Login";
import Images from "./Components/Pages/Images";
import Folders from "./Components/Pages/Folders";

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <NavLink exact activeClassName="active" to="/Login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/images">
            Images
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/folders">
            Folders
          </NavLink>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/images" component={Images} />
        <Route path="/folders" component={Folders} />
      </Switch>
    </div>
  </Router>
);

//ReactDOM.render(<App />, document.getElementById("root"));

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
