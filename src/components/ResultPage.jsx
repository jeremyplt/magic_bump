import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ProductsPage } from "./ProductsPage";
import { CollectionsPage } from "./CollectionsPage";
import { AllProductsPage } from "./AllProductsPages";
import {
  Page,
  Layout,
  Card,
  PageActions,
  Banner,
  List,
} from "@shopify/polaris";
import { addUpsell, addCollectionUpsell } from "../services/UpsellService";
import { removeSelectedUpsells } from "../store/slices/selectedUpsellsSlice.js";

// const GET_PRODUCTS_BY_COLLECTION = gql``;

const ResultPage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeItem, setActiveItem] = useState();

  const history = useHistory();
  const dispatch = useDispatch();

  const shopUrl = useSelector((state) => state.shop.value).myshopifyDomain;
  const pageType = useSelector((state) => state.pageType.value);
  const selectedUpsells = useSelector((state) => state.selectedUpsells.value);

  let isDisabled = Object.keys(selectedUpsells).length > 0 ? false : true;

  async function saveUpsells() {
    if (pageType === "collections") {
      for (const key in selectedUpsells)
        addCollectionUpsell(shopUrl, key, selectedUpsells[key]);
    } else {
      for (const key in selectedUpsells)
        addUpsell(shopUrl, key, selectedUpsells[key]);
    }

    history.push("/");
  }

  function resetState() {
    // setSelectedItems([]);
    dispatch(removeSelectedUpsells());
    setActiveItem("");
  }

  function goBackButton() {
    history.push("/");
  }

  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          content: "Home",
          onAction: () => {
            resetState();
            goBackButton();
          },
        },
      ]}
      primaryAction={{
        content: "Save",
        disabled: isDisabled,
        onAction: () => {
          saveUpsells();
          resetState();
        },
      }}
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
            {pageType === "products" && <ProductsPage />}
            {pageType === "allProducts" && <AllProductsPage />}
            {pageType === "collections" && <CollectionsPage />}
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save",
          disabled: isDisabled,
          onAction: () => {
            saveUpsells();
            resetState();
          },
        }}
      />
    </Page>
  );
};

export default ResultPage;
