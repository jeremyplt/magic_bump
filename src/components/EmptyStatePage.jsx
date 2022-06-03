import { useState, useContext } from "react";
import { Page, Layout, EmptyState, Card, List, Banner } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../Context";
const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { setSelection, setPageType, shopUrl, shopUpsells } =
    useContext(GlobalContext);
  const history = useHistory();

  const handleSelection = (resources) => {
    history.push("/results");
    setOpenProduct(false);
    setOpenCollection(false);
    setSelection(resources.selection.map((product) => product.id));
    console.log(resources.selection);
  };

  return (
    <Page fullWidth>
      {openProduct && (
        <ResourcePicker // Resource picker component
          resourceType="Product"
          showVariants={false}
          open={open}
          actionVerb={ResourcePicker.ActionVerb.Select}
          onSelection={(resources) => handleSelection(resources)}
          onCancel={() => setOpenProduct(false)}
        />
      )}
      {openCollection && (
        <ResourcePicker // Resource picker component
          resourceType="Collection"
          showVariants={false}
          open={open}
          actionVerb={ResourcePicker.ActionVerb.Select}
          onSelection={(resources) => handleSelection(resources)}
          onCancel={() => setOpenCollection(false)}
        />
      )}
      <Layout>
        <Layout.Section>
          {shopUpsells.length > 0 ? (
            <Banner title="Step 1/3" status="success">
              <p>You have successfully set up your first upsells!</p>
            </Banner>
          ) : (
            <Card title="Step 1 of 3: Select products you want to add a bump on">
              <Card.Section>
                <p>
                  Bump will be displayed only on the product page you select.
                  You can add or remove products later. {shopUrl}
                </p>
              </Card.Section>
              <Card.Section>
                <Layout>
                  <Layout.Section oneThird>
                    <EmptyState
                      heading="Products"
                      action={{
                        content: "Select products",
                        onAction: () => {
                          setOpenProduct(true);
                          setSelection([]);
                          setPageType("product");
                        },
                      }}
                      image={img}
                      imageContained
                    >
                      <p>Select a single product or specific products.</p>
                    </EmptyState>
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <EmptyState
                      heading="Collections"
                      action={{
                        content: "Select collections",
                        onAction: () => {
                          setOpenCollection(true);
                          setSelection([]);
                          setPageType("collection");
                        },
                      }}
                      image={img}
                      imageContained
                    >
                      <p>Select all the products of one or more collections.</p>
                    </EmptyState>
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <EmptyState
                      heading="All products"
                      action={{
                        content: "Select all products",
                        onAction: () => {
                          setSelection([]);
                          setPageType("product");
                          history.push("/results");
                        },
                      }}
                      image={img}
                      imageContained
                    >
                      <p>Add a bump on all your products in only few clicks.</p>
                    </EmptyState>
                  </Layout.Section>
                </Layout>
              </Card.Section>
            </Card>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card
            title="Step 2 of 3: Customize your bump"
            primaryFooterAction={{ content: "Customize bump" }}
            sectioned
          >
            <p>
              This is the fun part! Design your bump colors, shape, font and
              more.
            </p>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card
            title="Step 3 of 3: Place the App section on your product page"
            primaryFooterAction={{ content: "Customize product page" }}
            sectioned
          >
            <Layout>
              <Layout.Section>
                <List type="number">
                  <List.Item>Open the customize page of your theme</List.Item>
                  <List.Item>
                    Select the product template in the top dropdown list
                  </List.Item>
                  <List.Item>
                    On the left pannel, click the "Add section", select the "App
                    section", and then choose "Magic Bump"
                  </List.Item>
                  <List.Item>Place the section on your product page</List.Item>
                </List>
              </Layout.Section>
              {showBanner && (
                <Layout.Section>
                  <Banner
                    title="Increase you conversion rate"
                    onDismiss={() => setShowBanner(false)}
                    status="info"
                  >
                    <p>
                      We suggest to add the bump section just above the call to
                      action button of your product page.
                    </p>
                  </Banner>
                </Layout.Section>
              )}
            </Layout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
