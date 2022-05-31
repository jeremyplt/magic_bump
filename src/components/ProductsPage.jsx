import { gql, useQuery } from "@apollo/client";
import {
  Page,
  Layout,
  Banner,
  Card,
  Button,
  Icon,
  TextContainer,
  Stack,
} from "@shopify/polaris";
import { useContext } from "react";
import { Loading } from "@shopify/app-bridge-react";
import { ProductsList } from "./ProductsList";
import { EmptyPageContext } from "../Context";
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

const GET_ALL_PRODUCTS_BY_ID = gql`
  query getAllProduct {
    products(first: 20) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export function ProductsPage() {
  const { selection } = useContext(EmptyPageContext);
  const {
    loading: allLoading,
    error: allError,
    data: allData,
    refetch: allRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ID, {
    skip: selection.length > 0,
  });

  if (allData)
    allData.products.edges.forEach((product) => {
      selection.push(product.node.id);
    });

  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_BY_ID, {
    skip: selection.length === 0,
    variables: { ids: selection },
  });

  if (loading || allLoading) return <Loading />;

  if (error || allError) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  if (data) {
    return <ProductsList data={data} />;
  }
}
