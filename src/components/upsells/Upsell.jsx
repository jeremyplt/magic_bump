import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import {
  GET_PRODUCTS_BY_ID,
  GET_COLLECTIONS_BY_ID,
  ADD_UPSELL_ALL_PRODUCTS,
  REMOVE_GLOBAL_UPSELL,
} from "../../utils/queries";
import { DeleteMinor } from "@shopify/polaris-icons";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton";
import { addPageType } from "../../store/slices/pageTypeSlice";
import {
  removeSelection,
  addSelection,
} from "../../store/slices/selectionSlice";
import {
  addGlobalUpsell,
  removeGlobalUpsell,
} from "../../store/slices/appSlice";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

function UpsellPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [openProduct, setOpenProduct] = useState(false);
  const [openAllProduct, setOpenAllProduct] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);

  const [addUpsellAllProducts] = useMutation(ADD_UPSELL_ALL_PRODUCTS);
  const [removeGlobalUpsellMetafield] = useMutation(REMOVE_GLOBAL_UPSELL);

  const history = useHistory();
  const dispatch = useDispatch();

  const upsells = useSelector((state) => state.upsells.value);
  const globalUpsellValue = [
    useSelector((state) => state.app?.value.metafield?.value),
  ];
  const globalUpsellId = useSelector((state) => state.app?.value.metafield?.id);
  const appInstallationId = useSelector((state) => state.app.value.id);

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
    data: globalProductData,
    loading: globalProductLoading,
    error: globalProductError,
  } = useQuery(GET_PRODUCTS_BY_ID, {
    skip: globalUpsellValue.length === 0,
    variables: { ids: globalUpsellValue },
  });

  const {
    data: collectionData,
    loading: collectionLoading,
    error: collectionError,
  } = useQuery(GET_COLLECTIONS_BY_ID, {
    skip: collectionUpsells.length === 0,
    variables: { ids: collectionUpsells },
  });

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
    removeGlobalUpsellMetafield({
      variables: {
        input: {
          id: id,
        },
      },
    });
    dispatch(removeGlobalUpsell());
  };

  useEffect(() => {
    console.log("global data :", globalProductData);
    console.log("global error :", globalProductError);
  }, [globalProductData, globalProductError]);

  return (
    <Page fullWidth title="Your Upsells">
      <div style={{ marginBottom: "20px" }}>
        {openProduct && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={true}
            // actionVerb={ResourcePicker.ActionVerb.Select}
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
            // actionVerb={ResourcePicker.ActionVerb.Select}
            onSelection={(resources) => saveUpsellAllProducts(resources)}
            onCancel={() => setOpenAllProduct(false)}
          />
        )}
        {openCollection && (
          <ResourcePicker
            resourceType="Collection"
            showVariants={false}
            open={true}
            // actionVerb={ResourcePicker.ActionVerb.Select}
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
                  dispatch(removeSelection());
                  dispatch(addPageType("products"));
                },
              }}
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
                            <Stack.Item>
                              <TextContainer>
                                <h3>
                                  <TextStyle variation="strong">
                                    Upsell
                                  </TextStyle>
                                </h3>
                                {item.metafield.reference.title}
                              </TextContainer>
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
              primaryFooterAction={{
                content: "Add Upsell on Collection",
                onAction: () => {
                  setOpenCollection(true);
                  dispatch(removeSelection());
                  dispatch(addPageType("collections"));
                },
              }}
              actions={
                collectionData && [
                  {
                    content: "Manage all",
                    onAction: () => history.push("/upsells/collections"),
                  },
                ]
              }
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
                            <Stack.Item>
                              <TextContainer>
                                <h3>
                                  <TextStyle variation="strong">
                                    Upsell
                                  </TextStyle>
                                </h3>
                                {item.metafield.reference.title}
                              </TextContainer>
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
            <Card
              title="All Products"
              actions={[
                globalProductData?.nodes.length === 0
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
                {globalProductData && (
                  <ResourceList // Defines your resource list component
                    resourceName={{ singular: "Product", plural: "Products" }}
                    items={globalProductData.nodes}
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
                {globalProductLoading && <ProductsListSkeleton />}
                {globalProductData?.nodes.length === 0 && (
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
