import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { updateShop } from "../services/ShopService";
import { useDispatch, useSelector } from "react-redux";
import { addShop } from "../store/slices/shopSlice.js";
import { addCurrentAppInstallation } from "../store/slices/appSlice.js";
import {
  addCollectionsIds,
  addProductsIds,
  addProducts,
  addCollections,
  addGlobal,
  changeProductLoading,
  changeCollectionLoading,
  changeGlobalProductLoading,
} from "../store/slices/upsellsSlice";
import {
  GET_SHOP_INFOS,
  GET_PRODUCTS_BY_ID,
  GET_COLLECTIONS_BY_ID,
} from "../utils/queries";

// Adding more informations about the shop in the DB
function GetShopData() {
  const { data } = useQuery(GET_SHOP_INFOS);

  const upsells = useSelector((state) => state.upsells.value);

  const productUpsells = upsells?.productsIds;
  const collectionUpsells = upsells?.collectionsIds;
  const globalUpsellValue = [
    useSelector((state) => state.app?.value.metafield?.value),
  ];

  const { data: productData, loading: productLoading } = useQuery(
    GET_PRODUCTS_BY_ID,
    {
      variables: { ids: productUpsells },
    }
  );

  const { data: globalProductData, loading: globalProductLoading } = useQuery(
    GET_PRODUCTS_BY_ID,
    {
      variables: { ids: globalUpsellValue },
    }
  );

  const { data: collectionData, loading: collectionLoading } = useQuery(
    GET_COLLECTIONS_BY_ID,
    {
      variables: { ids: collectionUpsells },
    }
  );

  const shopState = useSelector((state) => state.shop.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      const shop = data.shop;
      const currentAppInstallation = data.currentAppInstallation;
      const productsIds = data.products.edges.map((product) => product.node.id);
      const collections = data.collections.edges;
      const sortedCollections = collections.filter(
        (collection) => collection.node.metafield
      );
      const sortedCollectionsIds = sortedCollections.map(
        (collection) => collection.node.id
      );
      dispatch(addCurrentAppInstallation(currentAppInstallation));
      dispatch(addShop(shop));
      if (sortedCollectionsIds.length > 0)
        dispatch(addCollectionsIds(sortedCollectionsIds));
      if (productsIds.length > 0) dispatch(addProductsIds(productsIds));

      updateShop(shop);
    }
  }, [data]);

  useEffect(() => {
    if (productData) dispatch(addProducts(productData.nodes));
  }, [productData]);

  useEffect(() => {
    if (collectionData) dispatch(addCollections(collectionData.nodes));
  }, [collectionData]);

  useEffect(() => {
    if (globalProductData) dispatch(addGlobal(globalProductData.nodes));
  }, [globalProductData]);

  useEffect(() => {
    dispatch(changeProductLoading(productLoading));
  }, [productLoading]);

  useEffect(() => {
    dispatch(changeCollectionLoading(collectionLoading));
  }, [collectionLoading]);

  useEffect(() => {
    dispatch(changeGlobalProductLoading(globalProductLoading));
  }, [globalProductLoading]);

  return;
}

export default GetShopData;
