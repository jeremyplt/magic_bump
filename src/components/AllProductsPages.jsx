import { gql, useQuery } from "@apollo/client";
import { Banner } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { ProductsList } from "./ProductsList";
import { useDispatch } from "react-redux";
import { addSelection } from "../store/slices/selectionSlice.js";
import { useEffect } from "react";

const GET_ALL_PRODUCTS_BY_ID = gql`
  query getAllProduct {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
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
  }
`;

const formatData = (data) => {
  const products = data.products.edges;
  let newProduct = {};
  const newData = {
    nodes: [],
  };
  for (const product of data.products.edges) {
    newProduct = {
      descriptionHtml: product.node.descriptionHtml,
      handle: product.node.handle,
      id: product.node.id,
      title: product.node.title,
      images: product.node.images,
      variants: product.node.variants,
    };
    newData.nodes.push(newProduct);
  }
  return newData;
};

export function AllProductsPage() {
  const dispatch = useDispatch();

  const { loading, error, data, refetch } = useQuery(GET_ALL_PRODUCTS_BY_ID);

  let formatedData = null;

  useEffect(() => {
    if (data) {
      const selection = [];
      data.products.edges.forEach((product) => {
        selection.push(product.node.id);
      });
      dispatch(addSelection(selection));
    }
  }, [data]);

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  if (data) {
    formatedData = formatData(data);
    return <ProductsList data={formatedData} />;
  }
}
