import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  Stack,
  TextStyle,
  ResourceList,
  Button,
  TextContainer,
  Icon,
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import {
  addSelectedUpsells,
  removeSelectedUpsells,
} from "../../store/slices/selectedUpsellsSlice.js";

export function CollectionsList({ data }) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeItem, setActiveItem] = useState({});
  const selectedUpsells = useSelector((state) => state.selectedUpsells.value);

  const dispatch = useDispatch();

  function handleSelection(resources) {
    if (activeItem) {
      const newUpsell = {
        [activeItem.id]: {
          productId: resources.selection[0].id,
          productTitle: resources.selection[0].title,
        },
      };
      dispatch(addSelectedUpsells(newUpsell));
      setActiveItem({});
    } else if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        const newUpsell = {
          [item.id]: {
            collectionTitle: item.title,
            upsell: {
              productId: resources.selection[0].id,
              productTitle: resources.selection[0].title,
            },
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
      <ResourceList
        showHeader
        resourceName={{ singular: "Collection", plural: "Collections" }}
        items={data.nodes}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        renderItem={(item) => {
          return (
            <ResourceList.Item id={item.id}>
              <Stack>
                <Stack.Item fill>
                  <h3>
                    <TextStyle variation="strong">{item.title}</TextStyle>
                  </h3>
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
                        setActiveItem(item);
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
      ></ResourceList>
    </React.Fragment>
  );
}
