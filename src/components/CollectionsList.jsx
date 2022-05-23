import React, { useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Stack, TextStyle, ResourceList, Button } from "@shopify/polaris";

export function CollectionsList({ data }) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedUpsell, setSelectedUpsell] = useState({});
  const handleSelection = (resources) => {
    setOpen(false);
    console.log(resources);
    const upsellId = resources.selection.product.id;
  };
  const promotedBulkActions = [
    {
      content: "Bulk add upsell",
      onAction: () => {
        console.log("to do");
      },
    },
  ];

  return (
    <React.Fragment>
      <ResourcePicker
        resourceType="Product"
        open={open}
        actionVerb={ResourcePicker.ActionVerb.Select}
        selectMultiple={false}
        onSelection={(resources) => handleSelection(resources)}
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
                  <Button onClick={() => setOpen(true)} id={item.id}>
                    Add upsell
                  </Button>
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
      ></ResourceList>
    </React.Fragment>
  );
}
