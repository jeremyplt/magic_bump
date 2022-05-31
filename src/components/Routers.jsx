import React from "react";
import { Switch, Route, withRouter } from "react-router";
import { ClientRouter, RoutePropagator } from "@shopify/app-bridge-react";
import Upsell from "./Upsell";
import ResultPage from "./ResultPage";
import HomePage from "./HomePage";

function Routers(props) {
  const { history, location } = props;

  return (
    <>
      <ClientRouter history={history} />
      <RoutePropagator location={location} />
      <Switch>
        <Route path="/upsells">
          <Upsell />
        </Route>
        <Route path="/results">
          <ResultPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </>
  );
}

export default withRouter(Routers);
