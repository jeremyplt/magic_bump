import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Banner,
  List,
  PageActions,
  Card,
  Button,
  Icon,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { addSelection } from "../../store/slices/selectionSlice";
import { ProductsListUpsells } from "../lists/ProductsListUpsells";
import { addPageType } from "../../store/slices/pageTypeSlice";
import { UndoMajor } from "@shopify/polaris-icons";

function ProductsUpsellPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [open, setOpen] = useState(false);
  const [temporaryUpsells, setTemporaryUpsells] = useState([]);

  const productUpsells = useSelector((state) => state.upsells.value.products);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleSelection = (resources) => {
    setTemporaryUpsells([...resources.selection, ...temporaryUpsells]);
    setOpen(false);
  };

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
        content: "Add Upsell",
        onAction: () => setOpen(true),
      }}
      secondaryActions={
        <Button disabled>
          <Icon source={UndoMajor} color="base" />
        </Button>
      }
      title="Product Upsells"
      pagination={{
        hasNext: true,
      }}
    >
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={open}
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
            {
              <ProductsListUpsells
                temporaryUpsells={temporaryUpsells}
                setTemporaryUpsells={setTemporaryUpsells}
              />
            }
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Add Upsell",
          onAction: () => setOpen(true),
        }}
      />
    </Page>
  );
}

export default ProductsUpsellPage;
