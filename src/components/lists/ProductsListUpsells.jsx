import {
  ResourceList,
  TextStyle,
  Stack,
  Thumbnail,
  Button,
  Icon,
  TextContainer,
} from "@shopify/polaris";

import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { DeleteMinor } from "@shopify/polaris-icons";
import { removeProducts } from "../../store/slices/upsellsSlice.js";

export function ProductsListUpsells({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [upsells, setUpsells] = useState(data.nodes);
  const dispatch = useDispatch();

  const promotedBulkActions = [
    {
      content: "Bulk delete upsells",
    },
  ];

  const removeUpsells = (upsellsToRemove) => {
    const newUpsells = upsells.filter(
      (upsell) => !upsellsToRemove.includes(upsell.id)
    );
    setUpsells(newUpsells);
  };

  return (
    <React.Fragment>
      <ResourceList // Defines your resource list component
        showHeader
        resourceName={{ singular: "Product", plural: "Products" }}
        items={upsells}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        renderItem={(item) => {
          const media = (
            <Thumbnail
              source={
                item.images.edges[0]
                  ? item.images.edges[0].node.originalSrc
                  : ""
              }
              alt={
                item.images.edges[0] ? item.images.edges[0].node.altText : ""
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
                    <TextStyle variation="strong">{item.title}</TextStyle>
                  </h3>
                  <div>{price}</div>
                </Stack.Item>
                <Stack.Item>
                  <Stack>
                    <Stack.Item>
                      <TextContainer>
                        <h3>
                          <TextStyle variation="strong">Upsell</TextStyle>
                        </h3>
                        {item.metafield.reference.title}
                      </TextContainer>
                    </Stack.Item>
                    <Stack.Item>
                      <Button
                        onClick={() => {
                          removeUpsells([item.id]);
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
    </React.Fragment>
  );
}
