import React from "react";
import { Switch, Route, withRouter } from "react-router";
import { ClientRouter, RoutePropagator } from "@shopify/app-bridge-react";
import UpsellPage from "./upsells/Upsell";
import ResultPage from "./results/ResultPage";
import HomePage from "./homepage/HomePage";
import ProductsUpsellPage from "./upsells/ProductsUpsellPage";
import CollectionsUpsellPage from "./upsells/CollectionsUpsellPage";

function Routers(props) {
  const { history, location } = props;

  return (
    <>
      <ClientRouter history={history} />
      <RoutePropagator location={location} />
      <Switch>
        <Route path="/upsells/products">
          <ProductsUpsellPage />
        </Route>
        <Route path="/upsells/collections">
          <CollectionsUpsellPage />
        </Route>
        <Route path="/upsells">
          <UpsellPage />
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
