import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ProductsPage } from "./ProductsPage";
import { CollectionsPage } from "./CollectionsPage";
import { AllProductsPage } from "./AllProductsPages";
import { gql, useMutation } from "@apollo/client";
import {
  Page,
  Layout,
  Card,
  PageActions,
  Banner,
  List,
  Toast,
} from "@shopify/polaris";
import { removeAllSelectedUpsells } from "../store/slices/selectedUpsellsSlice.js";
import { addProducts } from "../store/slices/upsellsSlice";
import { toggleActive } from "../store/slices/toastSlice";

const ADD_PRODUCT_METAFIELD = gql`
  mutation ($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        metafields(first: 100) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
        tags
      }
    }
  }
`;

const ADD_COLLECTION_METAFIELD = gql`
  mutation ($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        metafields(first: 100) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  }
`;

const ADD_TAG_TO_PRODUCT = gql`
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ResultPage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeItem, setActiveItem] = useState();
  const [addProductMetafield] = useMutation(ADD_PRODUCT_METAFIELD);
  const [addCollectionMetafield] = useMutation(ADD_COLLECTION_METAFIELD);
  const [addTagToProduct] = useMutation(ADD_TAG_TO_PRODUCT);

  const history = useHistory();
  const dispatch = useDispatch();

  const pageType = useSelector((state) => state.pageType.value);
  const selectedUpsells = useSelector((state) => state.selectedUpsells.value);

  let isDisabled = Object.keys(selectedUpsells).length > 0 ? false : true;

  function saveUpsells() {
    if (pageType === "collections") {
      for (const key in selectedUpsells) {
        addCollectionMetafield({
          variables: {
            input: {
              id: key,
              metafields: [
                {
                  namespace: "collection",
                  key: "upsell",
                  value: selectedUpsells[key].productId,
                  type: "product_reference",
                },
              ],
            },
          },
        });
      }
    } else {
      for (const key in selectedUpsells) {
        addProductMetafield({
          variables: {
            input: {
              id: key,
              metafields: [
                {
                  namespace: "product",
                  key: "upsell",
                  value: selectedUpsells[key].productId,
                  type: "product_reference",
                },
              ],
            },
          },
        });
        addTagToProduct({
          variables: {
            id: key,
            tags: ["upsell"],
          },
        });
      }
      dispatch(addProducts(Object.keys(selectedUpsells)));
    }
  }

  function resetState() {
    dispatch(removeAllSelectedUpsells());
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
          dispatch(toggleActive());
          history.push("/");
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
            dispatch(toggleActive());
            history.push("/");
          },
        }}
      />
    </Page>
  );
};

export default ResultPage;
