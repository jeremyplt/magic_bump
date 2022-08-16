import {
  ResourceList,
  TextStyle,
  Stack,
  Thumbnail,
  Button,
  Icon,
  TextContainer,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DeleteMinor } from "@shopify/polaris-icons";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton";
import {
  removeProducts,
  removeProductsIds,
} from "../../store/slices/upsellsSlice";
import { REMOVE_METAFIELD, REMOVE_TAG_TO_PRODUCT } from "../../utils/queries";

export function ProductsListUpsells({ temporaryUpsells, setTemporaryUpsell }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [productSetup, setProductSetUp] = useState("");
  const [openUpsell, setOpenUpsell] = useState(false);

  const productUpsells = useSelector((state) => state.upsells.value.products);
  const productLoading = useSelector(
    (state) => state.upsells.value.productLoading
  );

  const [removeMetafield] = useMutation(REMOVE_METAFIELD);
  const [removeTagToProduct] = useMutation(REMOVE_TAG_TO_PRODUCT);

  const itemToDisplay = [...temporaryUpsells, ...productUpsells];

  const dispatch = useDispatch();

  const promotedBulkActions = [
    {
      content: "Bulk delete upsells",
    },
  ];

  const removeUpsells = (items) => {
    const metafields = items.map((item) => item.metafield.id);
    removeMetafield({
      variables: {
        input: {
          id: metafields[0],
        },
      },
    });
    const ids = items.map((item) => item.id);
    removeTagToProduct({
      variables: {
        id: ids[0],
        tags: ["upsell"],
      },
    });
    dispatch(removeProducts(ids));
    dispatch(removeProductsIds(ids));
  };

  const saveUpsell = (resources) => {
    const upsell = resources.selection[0];
    // Add the metafield to the product
    // Add the tag to the product
    // Add the id to the state
    // Fetch the product (thanks to the productSetup ID, I can find it in the temporaryUpsells) and add the metafield then push it to the state at the beggining
    // Remove the product from the temporary state
    console.log("upsell", resources);
    console.log("id", productSetup);
    setOpenUpsell(false);
  };

  return (
    <React.Fragment>
      {openUpsell && (
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          allowMultiple={false}
          open={openUpsell}
          onSelection={(resources) => saveUpsell(resources)}
          onCancel={() => setOpenUpsell(false)}
        />
      )}
      {productUpsells && (
        <ResourceList
          showHeader
          resourceName={{ singular: "Product", plural: "Products" }}
          items={itemToDisplay}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          promotedBulkActions={promotedBulkActions}
          renderItem={(item) => {
            let source = "";
            let alt = "";

            if (item.images.edges) {
              if (item.images.edges[0])
                source = item.images.edges[0].node.originalSrc;
            } else if (item.images[0]) {
              source = item.images[0]?.originalSrc;
            }

            if (item.images.edges) {
              if (item.images.edges[0]) alt = item.images.edges[0].node.altText;
            } else if (item.images[0]) {
              alt = item.images[0]?.altText;
            }

            const media = <Thumbnail source={source} alt={alt} />;
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
                      <TextStyle variation="strong">{item.title}</TextStyle>
                    </h3>
                    <div>{price}</div>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack>
                      <Stack.Item>
                        <TextContainer>
                          {item.metafield && (
                            <div>
                              <h3>
                                <TextStyle variation="strong">Upsell</TextStyle>
                              </h3>
                              <span>{item.metafield?.reference?.title}</span>{" "}
                            </div>
                          )}

                          {!item.metafield && (
                            <Button
                              onClick={() => {
                                setOpenUpsell(true);
                                setProductSetUp(item.id);
                              }}
                            >
                              Add Upsell
                            </Button>
                          )}
                        </TextContainer>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          onClick={() => {
                            removeUpsells([item]);
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
      {productLoading && !productUpsells && (
        <div style={{ padding: 20 }}>
          <ProductsListSkeleton />
        </div>
      )}
    </React.Fragment>
  );
}
