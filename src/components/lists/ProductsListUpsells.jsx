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
  updateProductMetafield as updateProductMetafieldState,
} from "../../store/slices/upsellsSlice";

import {
  REMOVE_METAFIELD,
  REMOVE_TAG_TO_PRODUCT,
  UPDATE_PRODUCT_METAFIELD,
} from "../../utils/queries";

export function ProductsListUpsells() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [productUpdate, setProductUpdate] = useState("");

  const productUpsells = useSelector((state) => state.upsells.value.products);
  const productLoading = useSelector(
    (state) => state.upsells.value.productLoading
  );

  const [removeMetafield] = useMutation(REMOVE_METAFIELD);
  const [removeTagToProduct] = useMutation(REMOVE_TAG_TO_PRODUCT);
  const [updateProductMetafield] = useMutation(UPDATE_PRODUCT_METAFIELD);

  const dispatch = useDispatch();

  const promotedBulkActions = [
    {
      content: "Bulk delete upsells",
      onAction: () => {
        const itemsToDelete = productUpsells.filter((item) =>
          selectedItems.includes(item.id)
        );
        removeUpsells(itemsToDelete);
      },
    },
  ];

  const removeUpsells = (items) => {
    const metafields = items.map((item) => item.metafield.id);
    const ids = items.map((item) => item.id);

    metafields.forEach((meta) => {
      removeMetafield({
        variables: {
          input: {
            id: meta,
          },
        },
      });
    });

    ids.forEach((id) => {
      removeTagToProduct({
        variables: {
          id: id,
          tags: ["upsell"],
        },
      });
    });

    dispatch(removeProducts(ids));
    dispatch(removeProductsIds(ids));
    setSelectedItems([]);
  };

  const updateUpsell = (resources) => {
    const upsellId = resources.selection[0].id;
    const upsellTitle = resources.selection[0].title;
    const productId = productUpdate.id;

    updateProductMetafield({
      variables: {
        input: {
          id: productId,
          metafields: [
            {
              id: productUpdate.metafield.id,
              value: upsellId,
            },
          ],
        },
      },
    });

    dispatch(
      updateProductMetafieldState({
        productId,
        upsellId,
        upsellTitle,
      })
    );

    setOpen(false);
  };

  return (
    <React.Fragment>
      {open && (
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          allowMultiple={false}
          open={open}
          onSelection={(resources) => updateUpsell(resources)}
          onCancel={() => setOpen(false)}
        />
      )}
      {productUpsells.length > 0 && (
        <ResourceList
          showHeader
          resourceName={{ singular: "Product", plural: "Products" }}
          items={productUpsells}
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
                        </TextContainer>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          onClick={() => {
                            setProductUpdate(item);
                            setOpen(true);
                          }}
                        >
                          Update
                        </Button>
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
      {productLoading && productUpsells.length === 0 && (
        <div style={{ padding: "25px" }}>
          <ProductsListSkeleton />
        </div>
      )}
      {productUpsells.length === 0 && !productLoading && (
        <div style={{ padding: 20 }}>
          There is currently no product upsell set up.
        </div>
      )}
    </React.Fragment>
  );
}
