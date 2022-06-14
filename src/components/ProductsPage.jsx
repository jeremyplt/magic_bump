import { useQuery } from "@apollo/client";
import { Banner } from "@shopify/polaris";
import { ProductsList } from "./ProductsList";
import { useSelector } from "react-redux";
import { GET_PRODUCTS_BY_ID } from "../utils/queries";
import ProductsListSkeleton from "./skeletons/ProductsListSkeleton";

export function ProductsPage() {
  const selection = useSelector((state) => state.selection.value);

  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_BY_ID, {
    skip: selection.length === 0,
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
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  if (data) {
    return <ProductsList data={data} />;
  }
}
