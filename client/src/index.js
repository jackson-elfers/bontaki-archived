import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import "./styles";
import {
  Home,
  ResolvedDate,
  Menu,
  Account,
  About,
  Tutorial,
  Dashboard,
  Notifications,
  CreateIssue,
  ReadIssueId,
  ReadIssue,
  UpdateIssue,
  DeleteIssue,
  Admin,
  Login,
  Logout,
  Register,
  UpdateUsername,
  UpdatePassword,
  Unregister,
  NotFound
} from "./pages";
import { Status, Scroll, SetUser, Notice } from "./components";
import { routes } from "./config";
import * as serviceWorker from "./serviceWorker";

const routing = (
  <Provider store={store}>
    <Router>
      <SetUser />
      <Scroll>
        <Status />
        <Notice>
          <Switch>
            <Route exact path={routes.Home} component={Home} />
            <Route exact path={routes.ResolvedDate} component={ResolvedDate} />
            <Route exact path={routes.Menu} component={Menu} />
            <Route exact path={routes.Account} component={Account} />
            <Route exact path={routes.About} component={About} />
            <Route exact path={routes.Tutorial} component={Tutorial} />
            <Route exact path={routes.Dashboard} component={Dashboard} />
            <Route exact path={routes.Notifications} component={Notifications} />
            <Route exact path={routes.CreateIssue} component={CreateIssue} />
            <Route exact path={`${routes.ReadIssueId}/:_id`} component={ReadIssueId} />
            <Route exact path={`${routes.ReadIssue}/:url_title`} component={ReadIssue} />
            <Route exact path={`${routes.UpdateIssue}/:url_title`} component={UpdateIssue} />
            <Route exact path={`${routes.DeleteIssue}/:url_title`} component={DeleteIssue} />
            <Route exact path={routes.Login} component={Login} />
            <Route exact path={routes.Logout} component={Logout} />
            <Route exact path={routes.Register} component={Register} />
            <Route exact path={routes.UpdateUsername} component={UpdateUsername} />
            <Route exact path={routes.UpdatePassword} component={UpdatePassword} />
            <Route exact path={routes.Unregister} component={Unregister} />
            <Route component={NotFound} />
          </Switch>
        </Notice>
      </Scroll>
    </Router>
  </Provider>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
