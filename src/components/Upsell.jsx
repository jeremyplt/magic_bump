import React from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import { useSelector } from "react-redux";

function UpsellPage() {
  return (
    <Page
      fullWidth
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

export default UpsellPage;
