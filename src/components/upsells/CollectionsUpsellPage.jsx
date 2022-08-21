import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Banner,
  List,
  PageActions,
  Card,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COLLECTIONS_BY_ID } from "../../utils/queries";
import { useSelector, useDispatch } from "react-redux";
import ProductsListSkeleton from "../skeletons/ProductsListSkeleton";
import {
  addSelection,
  removeSelection,
} from "../../store/slices/selectionSlice";
import { CollectionsListUpsells } from "../lists/CollectionsListUpsells";
import { addPageType, addRedirectionPage } from "../../store/slices/pageSlice";
import { updateResourceAlreadyExist } from "../../store/slices/upsellsSlice";

function CollectionsUpsellPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [open, setOpen] = useState(false);

  const collectionUpsells = useSelector(
    (state) => state.upsells.value.collections
  );
  const collectionsWithUpsell = useSelector(
    (state) => state.upsells.value.collectionsIds
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const handleSelection = (resources) => {
    dispatch(updateResourceAlreadyExist(false));
    dispatch(addRedirectionPage("/upsells"));
    history.push("/results");
    setOpen(false);

    const itemSelectedId = resources.selection
      .map((collection) => collection.id)
      .filter((id) => !collectionsWithUpsell.includes(id));

    const itemsAlreadyExist = resources.selection
      .map((collection) => collection.id)
      .filter((id) => collectionsWithUpsell.includes(id));

    if (itemsAlreadyExist.length > 0)
      dispatch(updateResourceAlreadyExist(true));

    dispatch(addSelection(itemSelectedId));
  };

  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          content: "Upsells",
          onAction: () => {
            history.push("/upsells");
          },
        },
      ]}
      primaryAction={{
        content: "Add Upsells",
        onAction: () => setOpen(true),
      }}
      title="Collection Upsells"
      pagination={{
        hasNext: true,
      }}
    >
      <ResourcePicker
        resourceType="Collection"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        {showBanner && (
          <Layout.Section>
            <Banner
              title="Need Help?"
              onDismiss={() => setShowBanner(false)}
              status="info"
              action={{ content: "Help blog", url: "" }}
              secondaryAction={{ content: "Contact us", url: "" }}
            >
              <p>There is 2 different ways of setting up product upsells:</p>
              <Layout.Section>
                <List>
                  <List.Item>
                    <u>Option 1:</u> Select a different upsell for each product
                    (or collection) by using the <b>"Add upsell"</b> button.
                  </List.Item>
                  <List.Item>
                    <u>Option 2:</u> Want to use the same upsell for a selection
                    of products (or collections)? Use the <b>checkboxes</b> to
                    select them and bulk add the upsell.
                  </List.Item>
                </List>
              </Layout.Section>
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <CollectionsListUpsells />
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Add Upsells",
          onAction: () => {
            setOpen(true);
            dispatch(removeSelection());
            dispatch(addPageType("collections"));
          },
        }}
      />
    </Page>
  );
}

export default CollectionsUpsellPage;
