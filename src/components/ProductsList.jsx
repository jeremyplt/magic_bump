import {
  ResourceList,
  TextStyle,
  Stack,
  Thumbnail,
  Button,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import React, { useState } from "react";

export function ProductsList({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <ResourcePicker // Resource picker component
        resourceType="Product"
        showVariants={false}
        open={open}
        actionVerb={ResourcePicker.ActionVerb.Select}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <ResourceList // Defines your resource list component
        showHeader
        resourceName={{ singular: "Product", plural: "Products" }}
        items={data.nodes}
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
                </Stack.Item>
                <Stack.Item></Stack.Item>
                <Button onClick={() => setOpen(true)}>Add Product Bump</Button>
              </Stack>
            </ResourceList.Item>
          );
        }}
      />
    </React.Fragment>
  );
}
