import { gql } from "@apollo/client";

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
        metafield(namespace: "product", key: "upsell") {
          id
          value
          reference {
            ... on Product {
              title
            }
          }
        }
      }
    }
  }
`;

const GET_COLLECTIONS_BY_ID = gql`
  query getCollections($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        title
        id
        metafield(namespace: "collection", key: "upsell") {
          key
          type
          namespace
          reference {
            ... on Product {
              title
            }
          }
        }
        image {
          id
          originalSrc
          altText
        }
      }
    }
  }
`;
const ADD_PRODUCT_METAFIELD = gql`
  mutation ($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        metafields(first: 100) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
        tags
      }
    }
  }
`;

const ADD_COLLECTION_METAFIELD = gql`
  mutation ($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        metafields(first: 100) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  }
`;

const ADD_TAG_TO_PRODUCT = gql`
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_TAG_TO_PRODUCT = gql`
  mutation tagsRemove($id: ID!, $tags: [String!]!) {
    tagsRemove(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_UPSELL_ALL_PRODUCTS = gql`
  mutation ($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
        type
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_METAFIELD = gql`
  mutation metafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_SHOP_INFOS = gql`
  query getShopInfos {
    shop {
      billingAddress {
        firstName
        name
        address1
        address2
        city
        company
        zip
        country
        phone
      }
      currencyCode
      currencyFormats {
        moneyFormat
      }
      email
      id
      myshopifyDomain
      name
      plan {
        displayName
      }
      url
    }
    products(first: 50, query: "tag:upsell") {
      edges {
        node {
          id
        }
      }
    }
    collections(first: 50) {
      edges {
        node {
          id
          metafield(namespace: "collection", key: "upsell") {
            id
          }
        }
      }
    }
    currentAppInstallation {
      id
      metafield(namespace: "checkbox_global", key: "upsell") {
        id
        value
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

export {
  GET_SHOP_INFOS,
  GET_PRODUCTS_BY_ID,
  GET_ALL_PRODUCTS_BY_ID,
  REMOVE_METAFIELD,
  GET_COLLECTIONS_BY_ID,
  ADD_PRODUCT_METAFIELD,
  ADD_COLLECTION_METAFIELD,
  ADD_TAG_TO_PRODUCT,
  REMOVE_TAG_TO_PRODUCT,
  ADD_UPSELL_ALL_PRODUCTS,
};
