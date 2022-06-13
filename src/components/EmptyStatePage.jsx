import { useState } from "react";
import {
  Page,
  Layout,
  EmptyState,
  Card,
  List,
  Banner,
  TextContainer,
  Heading,
  Frame,
  Toast,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelection,
  removeSelection,
} from "../store/slices/selectionSlice.js";
import { addPageType } from "../store/slices/pageTypeSlice.js";
import { toggleActive } from "../store/slices/toastSlice";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  const shopUpsells = useSelector((state) => state.upsells.value);
  const active = useSelector((state) => state.toast.value);

  const toastMarkup = active ? (
    <Toast content="Upsells Saved" onDismiss={toggleActive} />
  ) : null;

  const handleSelection = (resources) => {
    history.push("/results");
    setOpenProduct(false);
    setOpenCollection(false);
    dispatch(addSelection(resources.selection.map((product) => product.id)));
  };

  return (
    <Page fullWidth>
      {openProduct && (
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={open}
          // actionVerb={ResourcePicker.ActionVerb.Select}
          onSelection={(resources) => handleSelection(resources)}
          onCancel={() => setOpenProduct(false)}
        />
      )}
      {openCollection && (
        <ResourcePicker
          resourceType="Collection"
          showVariants={false}
          open={open}
          // actionVerb={ResourcePicker.ActionVerb.Select}
          onSelection={(resources) => handleSelection(resources)}
          onCancel={() => setOpenCollection(false)}
        />
      )}
      <Layout>
        <Layout.Section>
          <TextContainer>
            <Heading>Welcome on Checkbox Upsell!</Heading>
            <p>
              Let's get started by following these <b>3 simple steps</b>. Once
              completed, you'll be able to have checkbox upsells on your store
              and <b>increase your sells</b>!
            </p>
          </TextContainer>
        </Layout.Section>
        <Layout.Section>
          {shopUpsells.products.length > 0 ||
          shopUpsells.collections.length > 0 ? (
            <Banner title="Step 1 of 3" status="success">
              <p>You have successfully set up your first upsells!</p>
            </Banner>
          ) : (
            <Card title="Step 1 of 3: Select products you want to add a bump on">
              <Card.Section>
                <p>
                  Bump will be displayed only on the product page you select.
                  You can add or remove products later.
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
                          dispatch(removeSelection());
                          dispatch(addPageType("products"));
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
                          dispatch(removeSelection());
                          dispatch(addPageType("collections"));
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
                          dispatch(removeSelection());
                          dispatch(addPageType("allProducts"));
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
      <Frame>{toastMarkup}</Frame>
    </Page>
  );
}
