import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Banner,
  List,
  PageActions,
  Card,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_ID } from "../utils/queries";
import { useSelector, useDispatch } from "react-redux";
import ProductsListSkeleton from "./skeletons/ProductsListSkeleton";
import { addSelection } from "../store/slices/selectionSlice";
import { ProductsListUpsells } from "./ProductsListUpsells";
import { addPageType } from "../store/slices/pageTypeSlice";

function ProductsUpsellPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [open, setOpen] = useState(false);

  const productUpsells = useSelector((state) => state.upsells.value.products);

  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids: productUpsells },
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const handleSelection = (resources) => {
    history.push("/results");
    setOpen(false);
    dispatch(addPageType("products"));
    dispatch(addSelection(resources.selection.map((product) => product.id)));
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          content: "Upsells",
          onAction: () => {
            history.goBack();
          },
        },
      ]}
      primaryAction={{
        content: "Add Upsells",
        onAction: () => setOpen(true),
      }}
      title="Product Upsells"
      pagination={{
        hasNext: true,
      }}
    >
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={open}
        // actionVerb={ResourcePicker.ActionVerb.Select}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
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
              <p>There is 2 different ways of setting up product upsells:</p>
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
            {data && <ProductsListUpsells data={data} />}
            {loading && (
              <div style={{ padding: "25px" }}>
                <ProductsListSkeleton />
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Add Upsells",
          onAction: () => setOpen(true),
        }}
      />
    </Page>
  );
}

export default ProductsUpsellPage;
