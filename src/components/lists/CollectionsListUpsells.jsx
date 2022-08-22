import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResourcePicker } from "@shopify/app-bridge-react";

import {
  Stack,
  TextStyle,
  ResourceList,
  Button,
  TextContainer,
  Icon,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import { removeSelectedUpsells } from "../../store/slices/selectedUpsellsSlice.js";
import { useMutation } from "@apollo/client";
import {
  REMOVE_METAFIELD,
  UPDATE_COLLECTION_METAFIELD,
  UPDATE_PRODUCT_METAFIELD,
} from "../../utils/queries.js";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton.jsx";
import {
  removeCollections,
  removeCollectionsIds,
  updateCollectionMetafield as updateCollectionMetafieldState,
} from "../../store/slices/upsellsSlice.js";

export function CollectionsListUpsells({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [collectionUpdate, setCollectionUpdate] = useState("");

  const collectionUpsells = useSelector(
    (state) => state.upsells.value.collections
  );
  const collectionLoading = useSelector(
    (state) => state.upsells.value.collectionLoading
  );

  const [removeMetafield] = useMutation(REMOVE_METAFIELD);
  const [updateCollectionMetafield] = useMutation(UPDATE_COLLECTION_METAFIELD);

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

    dispatch(removeCollections(ids));
    dispatch(removeCollectionsIds(ids));
    setSelectedItems([]);
  };

  const updateUpsell = (resources) => {
    const upsellId = resources.selection[0].id;
    const upsellTitle = resources.selection[0].title;
    const collectionId = collectionUpdate.id;

    updateCollectionMetafield({
      variables: {
        input: {
          id: collectionId,
          metafields: [
            {
              id: collectionUpdate.metafield.id,
              value: upsellId,
            },
          ],
        },
      },
    });

    dispatch(
      updateCollectionMetafieldState({
        collectionId,
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
      {collectionUpsells.length > 0 && (
        <ResourceList
          showHeader
          resourceName={{ singular: "Collection", plural: "Collections" }}
          items={collectionUpsells}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          promotedBulkActions={promotedBulkActions}
          renderItem={(item) => {
            const media = (
              <Thumbnail
                source={item.image ? item.imageoriginalSrc : ""}
                alt={item.image ? item.image.altText : ""}
              />
            );
            return (
              <ResourceList.Item id={item.id} media={media}>
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">{item.title}</TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <React.Fragment>
                      <Stack>
                        <Stack.Item>
                          <TextContainer>
                            <h3>
                              <TextStyle variation="strong">Upsell</TextStyle>
                            </h3>
                            {item.metafield?.reference?.title}
                          </TextContainer>
                        </Stack.Item>
                        <Stack.Item>
                          <Button
                            onClick={() => {
                              setCollectionUpdate(item);
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
                    </React.Fragment>
                  </Stack.Item>
                </Stack>
              </ResourceList.Item>
            );
          }}
        />
      )}
      {collectionLoading && collectionUpsells.length === 0 && (
        <div style={{ padding: "25px" }}>
          <ProductsListSkeleton />
        </div>
      )}
      {collectionUpsells.length === 0 && !collectionLoading && (
        <div style={{ padding: 20 }}>
          There is currently no collection upsell set up.
        </div>
      )}
    </React.Fragment>
  );
}
