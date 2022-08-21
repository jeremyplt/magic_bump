import { useState } from "react";
import { useMutation } from "@apollo/client";
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
  Stack,
  Button,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelection,
  removeSelection,
} from "../../store/slices/selectionSlice.js";
import {
  addPageType,
  addRedirectionPage,
} from "../../store/slices/pageSlice.js";
import { toggleActive } from "../../store/slices/toastSlice";
import { SET_METAFIELDS } from "../../utils/queries.js";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [openUpsell, setOpenUpsell] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [addUpsellAllProducts] = useMutation(SET_METAFIELDS);

  const history = useHistory();
  const dispatch = useDispatch();

  const shopUpsells = useSelector((state) => state.upsells.value);
  const globalUpsell = [
    useSelector((state) => state.app?.value.metafield?.value),
  ];
  const appInstallationId = useSelector((state) => state.app.value.id);
  const active = useSelector((state) => state.toast.value);

  const toastMarkup = active ? (
    <Toast
      content="Upsells Saved"
      duration={2000}
      onDismiss={() => dispatch(toggleActive())}
    />
  ) : null;

  const handleSelection = (resources) => {
    dispatch(addRedirectionPage("/"));
    history.push("/results");
    setOpenProduct(false);
    setOpenCollection(false);
    setOpenUpsell(false);
    dispatch(addSelection(resources.selection.map((product) => product.id)));
  };

  const saveUpsellAllProducts = (resources) => {
    const productId = resources.selection[0].id;
    addUpsellAllProducts({
      variables: {
        metafields: [
          {
            ownerId: appInstallationId,
            namespace: "checkbox_global",
            key: "upsell",
            value: productId,
            type: "product_reference",
          },
        ],
      },
    });
  };

  return (
    <Page fullWidth>
      <Frame>
        {openProduct && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={true}
            onSelection={(resources) => handleSelection(resources)}
            onCancel={() => setOpenProduct(false)}
          />
        )}
        {openUpsell && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={true}
            onSelection={(resources) => saveUpsellAllProducts(resources)}
            onCancel={() => setOpenUpsell(false)}
          />
        )}
        {openCollection && (
          <ResourcePicker
            resourceType="Collection"
            showVariants={false}
            open={true}
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
            shopUpsells.collections.length > 0 ||
            globalUpsell ? (
              <Banner title="Step 1 of 3" status="success">
                <p>You have successfully set up your first upsells!</p>
              </Banner>
            ) : (
              <Card title="Step 1 of 3: Select products you want to add an upsell on">
                <Card.Section>
                  <p>
                    Upsells will be displayed only on the products/collections
                    you will select. You will be able to choose upsells for each
                    product in the next step.
                  </p>
                </Card.Section>
                <Card.Section title="Option 1: Add different Upsell for a selection of products/collections">
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
                        <p>
                          Select one or more products and then choose an upsell
                          for each one.
                        </p>
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
                        <p>
                          Select one or more collections and then choose an
                          upsell for each one.
                        </p>
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
                        <p>
                          Select all products and choose a specific upsell for
                          each one.
                        </p>
                      </EmptyState>
                    </Layout.Section>
                  </Layout>
                </Card.Section>
                <Card.Section title="Option 2: Add the same upsell for all the product">
                  <Stack>
                    <Stack.Item fill>
                      <p style={{ marginTop: 15 }}>
                        Choose a global upsell that will be displayed on all the
                        available products of your store.
                      </p>
                    </Stack.Item>
                    <Stack.Item>
                      <Button
                        primary
                        onClick={() => {
                          setOpenUpsell(true);
                        }}
                      >
                        Add global Upsell
                      </Button>
                    </Stack.Item>
                  </Stack>
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
                      On the left pannel, click the "Add section", select the
                      "App section", and then choose "Magic Bump"
                    </List.Item>
                    <List.Item>
                      Place the section on your product page
                    </List.Item>
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
                        We suggest to add the bump section just above the call
                        to action button of your product page.
                      </p>
                    </Banner>
                  </Layout.Section>
                )}
              </Layout>
            </Card>
          </Layout.Section>
        </Layout>
        {toastMarkup}
      </Frame>
    </Page>
  );
}
