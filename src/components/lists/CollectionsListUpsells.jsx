import React, { useState } from "react";
import { useDispatch } from "react-redux";
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

export function CollectionsListUpsells({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();

  const promotedBulkActions = [
    {
      content: "Bulk deleet upsell",
    },
  ];

  return (
    <React.Fragment>
      <ResourceList
        showHeader
        resourceName={{ singular: "Collection", plural: "Collections" }}
        items={data.nodes}
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
                          {item.metafield.reference.title}
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
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
      ></ResourceList>
    </React.Fragment>
  );
}
