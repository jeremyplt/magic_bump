import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { Banner } from "@shopify/polaris";
import { CollectionsList } from "./CollectionsList";
import ProductsListSkeleton from "./skeletons/ProductsListSkeleton";
import { GET_COLLECTIONS_BY_ID } from "../utils/queries";

export function CollectionsPage() {
  const selection = useSelector((state) => state.selection.value);
  const { loading, error, data, refetch } = useQuery(GET_COLLECTIONS_BY_ID, {
    variables: { ids: selection },
  });

  if (loading)
    return (
      <div style={{ padding: "25px" }}>
        <ProductsListSkeleton />
      </div>
    );

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading collections.</Banner>
    );
  }

  return <CollectionsList data={data} />;
}
