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
import React, { useState, useContext } from "react";
import { DeleteMinor } from "@shopify/polaris-icons";
import { ProductsListContext } from "../Context";

export function ProductsList({ data }) {
  const [open, setOpen] = useState(false);
  const {
    selectedItems,
    setSelectedItems,
    activeProduct,
    setActiveProduct,
    selectedUpsell,
    setSelectedUpsell,
  } = useContext(ProductsListContext);

  const handleSelection = (resources) => {
    setOpen(false);
    if (activeProduct) {
      selectedUpsell[activeProduct] = {
        id: resources.selection[0].id,
        title: resources.selection[0].title,
      };
      setActiveProduct("");
    } else if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        selectedUpsell[item] = {
          id: resources.selection[0].id,
          title: resources.selection[0].title,
        };
        setSelectedItems([]);
      });
    }
  };
  const promotedBulkActions = [
    {
      content: "Bulk add upsell",
      onAction: () => {
        setOpen(true);
      },
    },
  ];

  return (
    <React.Fragment>
      <ResourcePicker // Resource picker component
        resourceType="Product"
        showVariants={false}
        open={open}
        selectMultiple={false}
        actionVerb={ResourcePicker.ActionVerb.Select}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <ResourceList // Defines your resource list component
        showHeader
        resourceName={{ singular: "Product", plural: "Products" }}
        items={data.nodes}
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
                  {selectedUpsell[item.id] ? (
                    <React.Fragment>
                      <Stack>
                        <Stack.Item>
                          <TextContainer>
                            <h3>
                              <TextStyle variation="strong">Upsell</TextStyle>
                            </h3>
                            {selectedUpsell[item.id].title}
                          </TextContainer>
                        </Stack.Item>
                        <Stack.Item>
                          <Button
                            onClick={() => {
                              delete selectedUpsell[item.id];
                              setSelectedUpsell({ ...selectedUpsell });
                            }}
                          >
                            <Icon source={DeleteMinor} color="base" />
                          </Button>
                        </Stack.Item>
                      </Stack>
                    </React.Fragment>
                  ) : (
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setActiveProduct(item.id);
                      }}
                    >
                      Add upsell
                    </Button>
                  )}
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
      />
    </React.Fragment>
  );
}
