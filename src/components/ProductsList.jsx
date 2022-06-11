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
import { DeleteMinor } from "@shopify/polaris-icons";
import {
  addSelectedUpsells,
  removeSelectedUpsells,
} from "../store/slices/selectedUpsellsSlice.js";

export function ProductsList({ data }) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeItem, setActiveItem] = useState("");

  const dispatch = useDispatch();
  const selectedUpsells = useSelector((state) => state.selectedUpsells.value);

  function handleSelection(resources) {
    if (activeItem) {
      const newUpsell = {
        [activeItem]: {
          productId: resources.selection[0].id,
          productTitle: resources.selection[0].title,
        },
      };
      dispatch(addSelectedUpsells(newUpsell));
      setActiveItem("");
    } else if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        const newUpsell = {
          [item]: {
            productId: resources.selection[0].id,
            productTitle: resources.selection[0].title,
          },
        };
        dispatch(addSelectedUpsells(newUpsell));
        setSelectedItems([]);
      });
    }
  }

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
        // actionVerb={ResourcePicker.ActionVerb.Select}
        onSelection={(resources) => {
          setOpen(false);
          handleSelection(resources);
        }}
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
                  {selectedUpsells[item.id] ? (
                    <React.Fragment>
                      <Stack>
                        <Stack.Item>
                          <TextContainer>
                            <h3>
                              <TextStyle variation="strong">Upsell</TextStyle>
                            </h3>
                            {selectedUpsells[item.id].productTitle}
                          </TextContainer>
                        </Stack.Item>
                        <Stack.Item>
                          <Button
                            onClick={() => {
                              dispatch(removeSelectedUpsells([item.id]));
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
                        setActiveItem(item.id);
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
