import React, { useState } from "react";
import { ProductsPage } from "./ProductsPage";
import { CollectionsPage } from "./CollectionsPage";
import {
  Page,
  Layout,
  Card,
  PageActions,
  Banner,
  List,
} from "@shopify/polaris";

const ResultPage = (props) => {
  const [showBanner, setShowBanner] = useState(true);
  const { pageType, itemIds, setEmptyPage, setSelection } = props;
  const resetEmptyPage = () => {
    setEmptyPage(true);
    setSelection([]);
  };

  return (
    <Page
      fullWidth
      breadcrumbs={[{ content: "Home", onAction: resetEmptyPage }]}
      primaryAction={{ content: "Save", disabled: true }}
      title="Upsell setup"
      pagination={{
        hasNext: true,
      }}
    >
      <Layout>
        {showBanner && (
          <Layout.Section>
            <Banner
              title="Need Help?"
              onDismiss={() => setShowBanner(false)}
              status="info"
              action={{ content: "Help blog", url: "" }}
              secondaryAction={{ content: "Contact us", url: "" }}
            >
              <p>
                You're half way of being all set up! Simply choose which product
                you want to propose to your customer as an upsell.
              </p>
              <Layout.Section>
                <List>
                  <List.Item>
                    <u>Option 1:</u> Select a different upsell for each product
                    (or collection) by using the <b>"Add upsell"</b> button.
                  </List.Item>
                  <List.Item>
                    <u>Option 2:</u> Want to use the same upsell for a selection
                    of products (or collections)? Use the <b>checkboxes</b> to
                    select them and bulk add the upsell.
                  </List.Item>
                </List>
              </Layout.Section>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            {pageType === "product" ? (
              <ProductsPage itemIds={itemIds} />
            ) : (
              <CollectionsPage itemIds={itemIds} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save",
        }}
      />
    </Page>
  );
};

export default ResultPage;
