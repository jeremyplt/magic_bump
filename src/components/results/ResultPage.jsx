import React, { useState } from "react";
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
import { removeAllSelectedUpsells } from "../../store/slices/selectedUpsellsSlice.js";
import {
  addProductsIds,
  addCollectionsIds,
} from "../../store/slices/upsellsSlice";
import { toggleActive } from "../../store/slices/toastSlice";
import {
  ADD_PRODUCT_METAFIELD,
  ADD_COLLECTION_METAFIELD,
  ADD_TAG_TO_PRODUCT,
} from "../../utils/queries";

const ResultPage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeItem, setActiveItem] = useState();
  const [addProductMetafield] = useMutation(ADD_PRODUCT_METAFIELD);
  const [addCollectionMetafield] = useMutation(ADD_COLLECTION_METAFIELD);
  const [addTagToProduct] = useMutation(ADD_TAG_TO_PRODUCT);

  const history = useHistory();
  const dispatch = useDispatch();

  const pageType = useSelector((state) => state.page.value.type);
  const pageRedirection = useSelector((state) => state.page.value.redirection);
  const selectedUpsells = useSelector((state) => state.selectedUpsells.value);
  const resourceAlreadyExist = useSelector(
    (state) => state.upsells.value.resourceAlreadyExist
  );

  let isDisabled = Object.keys(selectedUpsells).length > 0 ? false : true;

  function saveUpsells() {
    console.log("selectedUpsells", selectedUpsells);
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
      dispatch(addCollectionsIds(Object.keys(selectedUpsells)));
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
      dispatch(addProductsIds(Object.keys(selectedUpsells)));
    }
  }

  function resetState() {
    dispatch(removeAllSelectedUpsells());
    setActiveItem("");
  }

  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          content: "Home",
          onAction: () => {
            resetState();
            history.push(pageRedirection ? pageRedirection : "/");
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
          history.push(pageRedirection);
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

        {resourceAlreadyExist && (
          <Layout.Section>
            <Banner
              title="Warning"
              onDismiss={() => setShowBanner(false)}
              status="warning"
            >
              <p>
                Some of the product you selected already have an upsell setup.
                You can update a product by clicking the "Update" button on the
                Manage Upsells page.
              </p>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            {pageType === "products" && <ProductsPage />}
            {pageType === "allProducts" && <AllProductsPage />}
            {pageType === "collections" && <CollectionsPage />}
            {resourceAlreadyExist && (
              <div style={{ padding: 20 }}>
                The products you selected already have an upsell setup. Go back
                to the previous page and update the upsell of these products.
              </div>
            )}
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
            history.push(pageRedirection ? pageRedirection : "/");
          },
        }}
      />
    </Page>
  );
};

export default ResultPage;
