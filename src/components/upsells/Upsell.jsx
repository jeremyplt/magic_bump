import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Page,
  Layout,
  Card,
  TextStyle,
  ResourceList,
  Thumbnail,
  Stack,
  Banner,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { GET_PRODUCTS_BY_ID, GET_COLLECTIONS_BY_ID } from "../../utils/queries";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

function UpsellPage() {
  const [showBanner, setShowBanner] = useState(true);

  const history = useHistory();

  const upsells = useSelector((state) => state.upsells.value);
  const productUpsells = upsells.products;
  const collectionUpsells = upsells.collections;

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCTS_BY_ID, {
    skip: productUpsells.length === 0,
    variables: { ids: productUpsells },
  });

  const {
    data: collectionData,
    loading: collectionLoading,
    error: collectionError,
  } = useQuery(GET_COLLECTIONS_BY_ID, {
    skip: collectionUpsells.length === 0,
    variables: { ids: collectionUpsells },
  });

  return (
    <Page fullWidth title="Your Upsells">
      <div style={{ marginBottom: "20px" }}>
        <ResourcePicker
          resourceType="Product"
          open={open}
          // actionVerb={ResourcePicker.ActionVerb.Select}
          selectMultiple={false}
          onSelection={(resources) => {
            setOpen(false);
            handleSelection(resources);
          }}
          onCancel={() => setOpen(false)}
          showVariants={false}
        />
        <Layout>
          {showBanner && (
            <Layout.Section fullWidth>
              <Banner
                title="Priority Rules"
                onDismiss={() => setShowBanner(false)}
                status="warning"
                action={{ content: "Help blog", url: "" }}
                secondaryAction={{ content: "Contact us", url: "" }}
              >
                <p>
                  If a product belong to several rules, the rules apply in the
                  following order (from the strongest to the weakest):
                </p>
                <p style={{ marginTop: "5px" }}>
                  <b>Product</b> > <b>Collection</b> > <b>All products</b>
                </p>
                <div style={{ marginTop: "5px" }}>
                  <u>
                    <b>Example:</b>
                  </u>
                  <p style={{ marginTop: "5px" }}>
                    Let's say you have a{" "}
                    <b style={{ color: "#541021" }}>Red T-shirt</b> in your{" "}
                    <b style={{ color: "#102354" }}>T-shirt Collection.</b>
                  </p>
                  <p style={{ marginTop: "5px" }}>
                    If you put a <b style={{ color: "#102354" }}>Blue Cap</b> as
                    a global upsell for the whole{" "}
                    <b style={{ color: "#102354" }}>T-shirt collection</b> but a{" "}
                    <b style={{ color: "#541021" }}>Red Cap</b> for the{" "}
                    <b style={{ color: "#541021" }}>Red T-shirt</b>, then the
                    upsell displayed on the{" "}
                    <b style={{ color: "#541021" }}>Red T-shirt</b> product page
                    will be the <b style={{ color: "#541021" }}>Red Cap</b>
                  </p>
                </div>
              </Banner>
            </Layout.Section>
          )}
          <Layout.Section oneHalf>
            <Card
              title="Product Upsells"
              primaryFooterAction={{ content: "Add Upsell on Product" }}
              actions={
                productData && {
                  content: "Manage all",
                  onAction: () => history.push("/upsells/products"),
                }
              }
            >
              {productData && (
                <Card.Section>
                  <TextStyle variation="subdued">
                    6 products with upsells
                  </TextStyle>
                </Card.Section>
              )}
              <Card.Section title={productData && "Products"}>
                {productData && (
                  <ResourceList // Defines your resource list component
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={productData.nodes.slice(0, 4)}
                    renderItem={(item) => {
                      const media = (
                        <Thumbnail
                          source={
                            item.images.edges[0]
                              ? item.images.edges[0].node.originalSrc
                              : ""
                          }
                          alt={
                            item.images.edges[0]
                              ? item.images.edges[0].node.altText
                              : ""
                          }
                        />
                      );
                      const price = item.variants.edges[0].node.price;
                      return (
                        <ResourceList.Item
                          id={item.id}
                          media={media}
                          accessibilityLabel={`View details for ${item.title}`}
                        >
                          <Stack>
                            <Stack.Item fill>
                              <h3>
                                <TextStyle variation="strong">
                                  {item.title}
                                </TextStyle>
                              </h3>
                              <div>{price}</div>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
                {productLoading && <ProductsListSkeleton />}
                {!productData && !productLoading && (
                  <TextStyle>
                    There is currently no product upsell set up.
                  </TextStyle>
                )}
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card
              title="Collection Upsells"
              primaryFooterAction={{ content: "Add Upsell on Collection" }}
              actions={collectionData && [{ content: "Manage all" }]}
            >
              {collectionData && (
                <Card.Section>
                  <TextStyle variation="subdued">
                    6 collections with upsells
                  </TextStyle>
                </Card.Section>
              )}
              <Card.Section title={collectionData && "Collection"}>
                {collectionData && (
                  <ResourceList // Defines your resource list component
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={collectionData.nodes.slice(0, 4)}
                    renderItem={(item) => {
                      return (
                        <ResourceList.Item
                          id={item.id}
                          accessibilityLabel={`View details for ${item.title}`}
                        >
                          <Stack>
                            <Stack.Item fill>
                              <h3>
                                <TextStyle variation="strong">
                                  {item.title}
                                </TextStyle>
                              </h3>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
                {collectionLoading && <ProductsListSkeleton />}
                {!collectionData && !collectionLoading && (
                  <TextStyle>
                    There is currently no collection upsell set up.
                  </TextStyle>
                )}
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card title="All Products" actions={[{ content: "Add Upsell" }]}>
              <Card.Section>
                <Stack>
                  <Stack.Item fill>
                    <p>
                      This upsell will apply on all products. More accurate
                      rules (collections and products) will override this upsell
                      for the specific product or collection.
                    </p>
                  </Stack.Item>
                  <Stack.Item></Stack.Item>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
}

export default UpsellPage;
