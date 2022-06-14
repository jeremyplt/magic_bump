import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { updateShop } from "../services/ShopService";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../store/slices/shopSlice.js";
import { addCollections, addProducts } from "../store/slices/upsellsSlice";
import { GET_SHOP_INFOS } from "../utils/queries";

// Adding more informations about the shop in the DB
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
