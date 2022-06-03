import React, { useContext } from "react";
import { Page, Layout, Card, PageActions } from "@shopify/polaris";
import { ProductsList } from "./ProductsList";

import { GlobalContext } from "../Context";

function Upsell() {
  const { shopUpsells, resetEmptyPage } = useContext(GlobalContext);
  return (
    <Page
      fullWidth
      breadcrumbs={[{ content: "Home", onAction: resetEmptyPage }]}
      title="Your Upsells"
      pagination={{
        hasNext: true,
      }}
    >
      <Layout>
        <Layout.Section>
          <Card></Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Upsell;
