import React, { useContext, useState } from "react";
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
import { GlobalContext, ProductsListContext } from "../Context.js";
import { addUpsell } from "../services/UpsellService";

const ResultPage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeProduct, setActiveProduct] = useState();
  const [selectedUpsell, setSelectedUpsell] = useState({});

  const {
    pageType,
    setSelection,
    selection,
    shopUrl,
    shopUpsells,
    setShopUpsells,
    history,
    resetEmptyPage,
  } = useContext(GlobalContext);

  const productsListProps = {
    selectedItems,
    setSelectedItems,
    activeProduct,
    setActiveProduct,
    selectedUpsell,
    setSelectedUpsell,
  };

  let isDisabled = Object.keys(selectedUpsell).length > 0 ? false : true;

  const saveUpsells = () => {
    for (const key in selectedUpsell) {
      addUpsell(shopUrl, key, selectedUpsell[key]);
    }
    history.push("/");
  };

  return (
    <Page
      fullWidth
      breadcrumbs={[{ content: "Home", onAction: resetEmptyPage }]}
      primaryAction={{ content: "Save", disabled: isDisabled }}
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
            <ProductsListContext.Provider value={{ ...productsListProps }}>
              {pageType === "product" ? <ProductsPage /> : <CollectionsPage />}
            </ProductsListContext.Provider>
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save",
          disabled: isDisabled,
          onAction: () => saveUpsells(),
        }}
      />
    </Page>
  );
};

export default ResultPage;
