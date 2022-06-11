import { gql, useQuery } from "@apollo/client";
import { Banner } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { ProductsList } from "./ProductsList";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addSelection } from "../store/slices/selectionSlice.js";
// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// product variants can have different prices.
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

export function ProductsPage() {
  const selection = useSelector((state) => state.selection.value);

  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_BY_ID, {
    skip: selection.length === 0,
    variables: { ids: selection },
  });

  if (loading) return <Loading />;

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
