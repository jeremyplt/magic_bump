import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Page,
  Layout,
  Card,
  TextStyle,
  TextContainer,
  ResourceList,
  Thumbnail,
  Stack,
  Banner,
  Button,
  Icon,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { SET_METAFIELDS, REMOVE_METAFIELD } from "../../utils/queries";
import { DeleteMinor } from "@shopify/polaris-icons";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton";
import SingleProductSkeleton from "../skeletons/SingleProductSkeleton";
import { addPageType, addRedirectionPage } from "../../store/slices/pageSlice";
import {
  removeSelection,
  addSelection,
} from "../../store/slices/selectionSlice";
import {
  addGlobalUpsell,
  removeGlobalUpsellId,
} from "../../store/slices/appSlice";
import {
  removeGlobalUpsellProduct,
  addGlobal,
} from "../../store/slices/upsellsSlice";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

function UpsellPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [openProduct, setOpenProduct] = useState(false);
  const [openAllProduct, setOpenAllProduct] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);
  const [productLoader, setProductLoader] = useState(false);
  const [collectionLoader, setCollectionLoader] = useState(false);

  const [addUpsellAllProducts] = useMutation(SET_METAFIELDS);
  const [removeMetafield] = useMutation(REMOVE_METAFIELD);

  const history = useHistory();
  const dispatch = useDispatch();

  const upsells = useSelector((state) => state.upsells.value);

  const globalUpsellId = useSelector((state) => state.app?.value.metafield?.id);
  const appInstallationId = useSelector((state) => state.app.value.id);

  const productLoading = useSelector(
    (state) => state.upsells.value.productLoading
  );
  const collectionLoading = useSelector(
    (state) => state.upsells.value.collectionLoading
  );
  const globalProductLoading = useSelector(
    (state) => state.upsells.value.globalProductLoading
  );

  const productUpsells = upsells.products;
  const collectionUpsells = upsells.collections;
  const productsIds = upsells.productsIds;
  const collectionsIds = upsells.collectionsIds;
  const globalUpsell = upsells.global;

  const globalUpsellActions = [
    {
      content: "Add Upsell",
      onAction: () => setOpenAllProduct(true),
    },
    {
      content: "Remove Upsell",
      onAction: () => removeUpsellAllProducts(globalUpsellId),
    },
  ];

  const handleSelection = (resources) => {
    history.push("/results");
    setOpenProduct(false);
    setOpenAllProduct(false);
    setOpenCollection(false);
    dispatch(addSelection(resources.selection.map((product) => product.id)));
  };

  const saveUpsellAllProducts = async (resources) => {
    dispatch(addGlobal([resources.selection[0]]));
    const value = resources.selection[0].id;
    const payload = await addUpsellAllProducts({
      variables: {
        metafields: [
          {
            ownerId: appInstallationId,
            namespace: "checkbox_global",
            key: "upsell",
            value: value,
            type: "product_reference",
          },
        ],
      },
    });
    const id = payload.data.metafieldsSet.metafields[0].id;
    dispatch(addGlobalUpsell({ value, id }));
    setOpenAllProduct(false);
  };

  const removeUpsellAllProducts = (id) => {
    removeMetafield({
      variables: {
        input: {
          id: id,
        },
      },
    });
    dispatch(removeGlobalUpsellId());
    dispatch(removeGlobalUpsellProduct());
  };

  useEffect(() => {
    if (productLoader === true) setProductLoader(false);
  }, [productUpsells, productsIds]);

  useEffect(() => {
    if (collectionLoader === true) setCollectionLoader(false);
  }, [collectionUpsells, collectionsIds]);

  useEffect(() => {
    if (productLoading) setProductLoader(true);
    else if (collectionLoading) setCollectionLoader(true);
  }, [productLoading, collectionLoading]);

  return (
    <Page fullWidth title="Your Upsells">
      <div style={{ marginBottom: "20px" }}>
        {openProduct && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={true}
            onSelection={(resources) => handleSelection(resources)}
            onCancel={() => setOpenProduct(false)}
          />
        )}
        {openAllProduct && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={true}
            selectMultiple={false}
            onSelection={(resources) => saveUpsellAllProducts(resources)}
            onCancel={() => setOpenAllProduct(false)}
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
              primaryFooterAction={{
                content: "Add Upsell on Product",
                onAction: () => {
                  setOpenProduct(true);
                  dispatch(addRedirectionPage("/upsells"));
                  dispatch(removeSelection());
                  dispatch(addPageType("products"));
                },
              }}
              actions={
                productUpsells.length > 0 && {
                  content: "Manage all",
                  onAction: () => history.push("/upsells/products"),
                }
              }
            >
              {productUpsells.length > 0 && (
                <Card.Section>
                  <TextStyle variation="subdued">
                    {productUpsells.length} products with upsells
                  </TextStyle>
                </Card.Section>
              )}
              <Card.Section title={productUpsells.length > 0 && "Products"}>
                {productUpsells.length > 0 && (
                  <ResourceList
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={productUpsells.slice(0, 4)}
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
                            <Stack.Item>
                              <TextContainer>
                                <h3>
                                  <TextStyle variation="strong">
                                    Upsell
                                  </TextStyle>
                                </h3>
                                {item.metafield?.reference?.title}
                              </TextContainer>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
                {productLoading && productUpsells.length === 0 && (
                  <ProductsListSkeleton />
                )}
                {productLoader &&
                  productUpsells.length < 4 &&
                  productUpsells.length !== 0 && (
                    <div
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 5,
                      }}
                    >
                      <SingleProductSkeleton />
                    </div>
                  )}
                {productUpsells.length === 0 && !productLoading && (
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
              primaryFooterAction={{
                content: "Add Upsell on Collection",
                onAction: () => {
                  setOpenCollection(true);
                  dispatch(addRedirectionPage("/upsells"));
                  dispatch(removeSelection());
                  dispatch(addPageType("collections"));
                },
              }}
              actions={
                collectionUpsells.length > 0 && [
                  {
                    content: "Manage all",
                    onAction: () => history.push("/upsells/collections"),
                  },
                ]
              }
            >
              {collectionUpsells.length > 0 && (
                <Card.Section>
                  <TextStyle variation="subdued">
                    {collectionUpsells.length} collections with upsells
                  </TextStyle>
                </Card.Section>
              )}
              <Card.Section
                title={collectionUpsells.length > 0 && "Collection"}
              >
                {collectionUpsells.length > 0 && (
                  <ResourceList // Defines your resource list component
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={collectionUpsells.slice(0, 4)}
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
                            <Stack.Item>
                              <TextContainer>
                                <h3>
                                  <TextStyle variation="strong">
                                    Upsell
                                  </TextStyle>
                                </h3>
                                {item.metafield?.reference?.title}
                              </TextContainer>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}

                {collectionLoading && collectionUpsells.length === 0 && (
                  <ProductsListSkeleton />
                )}
                {collectionLoader &&
                  collectionUpsells.length < 4 &&
                  collectionUpsells.length !== 0 && (
                    <div
                      style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 5,
                      }}
                    >
                      <SingleProductSkeleton />
                    </div>
                  )}
                {collectionUpsells.length === 0 && !collectionLoading && (
                  <TextStyle>
                    There is currently no collection upsell set up.
                  </TextStyle>
                )}
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card
              title="All Products"
              actions={[
                globalUpsell.length === 0
                  ? globalUpsellActions[0]
                  : globalUpsellActions[1],
              ]}
            >
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
              <Card.Section>
                {globalUpsell.length > 0 && (
                  <ResourceList
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={globalUpsell}
                    renderItem={(item) => {
                      const media = (
                        <Thumbnail
                          source={
                            item.images.edges
                              ? item.images.edges[0]?.node.originalSrc
                              : item.images[0]?.originalSrc
                          }
                          alt={
                            item.images.edges
                              ? item.images.edges[0]?.node.altText
                              : item.images[0]?.altText
                          }
                        />
                      );
                      const price = item.variants.edges
                        ? item.variants.edges[0].node.price
                        : item.variants[0].price;
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
                            <Stack.Item>
                              <Stack>
                                <Stack.Item>
                                  <Button
                                    onClick={() => {
                                      setOpenAllProduct(true);
                                    }}
                                  >
                                    Update
                                  </Button>
                                </Stack.Item>
                                <Stack.Item>
                                  <Button
                                    onClick={() => {
                                      removeUpsellAllProducts(globalUpsellId);
                                    }}
                                  >
                                    <Icon source={DeleteMinor} color="base" />
                                  </Button>
                                </Stack.Item>
                              </Stack>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
                {globalProductLoading && globalUpsell.length === 0 && (
                  <SingleProductSkeleton />
                )}
                {globalUpsell.length === 0 && !globalProductLoading && (
                  <Layout>
                    <Layout.Section>
                      There is currently no global upsell set up.
                    </Layout.Section>
                  </Layout>
                )}
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
}

export default UpsellPage;
