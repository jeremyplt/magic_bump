import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { updateShop } from "../services/ShopService";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../store/slices/shopSlice.js";
import { addCollections, addProducts } from "../store/slices/upsellsSlice";

// Adding more informations about the shop in the DB

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
  }
`;

function GetShopData() {
  const { data, error } = useQuery(GET_SHOP_INFOS);
  const shopState = useSelector((state) => state.shop.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      const shop = data.shop;
      const productsIds = data.products.edges.map((product) => product.node.id);
      const collections = data.collections.edges;
      const sortedCollections = collections.filter(
        (collection) => collection.node.metafield
      );
      const sortedCollectionsIds = sortedCollections.map(
        (collection) => collection.node.id
      );

      dispatch(addShop(shop));
      if (sortedCollectionsIds.length > 0)
        dispatch(addCollections(sortedCollectionsIds));
      if (productsIds.length > 0) dispatch(addProducts(productsIds));

      updateShop(shop);
    }
  }, [data]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return;
}

export default GetShopData;
