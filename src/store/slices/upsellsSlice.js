import { createSlice } from "@reduxjs/toolkit";

const upsellsSlice = createSlice({
  name: "upsells",
  initialState: {
    value: {
      productsIds: [],
      collectionsIds: [],
      products: [],
      collections: [],
      global: [],
      productLoading: false,
      collectionLoading: false,
      globalProductLoading: false,
      refetchCollection: false,
      refetchProduct: false,
      resourceAlreadyExist: false,
    },
  },
  reducers: {
    addProductsIds: (state, action) => {
      const productsIds = [
        ...new Set([...state.value.productsIds, ...action.payload]),
      ];
      state.value = {
        ...state.value,
        productsIds: productsIds,
      };
    },
    removeProductsIds: (state, action) => {
      state.value.productsIds = state.value.productsIds.filter(
        (id) => !action.payload.includes(id)
      );
    },
    addCollectionsIds: (state, action) => {
      const collectionsIds = [
        ...new Set([...state.value.collectionsIds, ...action.payload]),
      ];
      state.value = { ...state.value, collectionsIds: collectionsIds };
    },
    addProducts: (state, action) => {
      const newState = [...action.payload, ...state.value.products];
      const products = Array.from(new Set(newState.map((a) => a.id))).map(
        (id) => {
          return newState.find((a) => a.id === id);
        }
      );
      state.value = { ...state.value, products: [...products] };
    },
    updateProductMetafield: (state, action) => {
      const { productId, upsellId, upsellTitle } = action.payload;
      const products = state.value.products;
      const index = products.findIndex((item) => item.id === productId);

      products[index].metafield.value = upsellId;
      products[index].metafield.reference.title = upsellTitle;

      state.value = { ...state.value, products: [...products] };
    },
    removeProducts: (state, action) => {
      const products = state.value.products.filter(
        (item) => !action.payload.includes(item.id)
      );
      state.value = { ...state.value, products: [...products] };
    },
    addCollections: (state, action) => {
      const newState = [...action.payload, ...state.value.collections];
      const collections = Array.from(new Set(newState.map((a) => a.id))).map(
        (id) => {
          return newState.find((a) => a.id === id);
        }
      );
      state.value = { ...state.value, collections: [...collections] };
    },
    updateCollectionMetafield: (state, action) => {
      const { collectionId, upsellId, upsellTitle } = action.payload;
      const collections = state.value.collections;
      const index = collections.findIndex((item) => item.id === collectionId);

      collections[index].metafield.value = upsellId;
      collections[index].metafield.reference.title = upsellTitle;

      state.value = { ...state.value, collections: [...collections] };
    },
    updateRefetchCollection: (state, action) => {
      state.value = { ...state.value, refetchCollection: action.payload };
    },
    updateRefetchProduct: (state, action) => {
      state.value = { ...state.value, refetchProduct: action.payload };
    },
    removeCollectionsIds: (state, action) => {
      state.value.collectionsIds = state.value.collectionsIds.filter(
        (id) => !action.payload.includes(id)
      );
    },
    removeCollections: (state, action) => {
      const collections = state.value.collections.filter(
        (item) => !action.payload.includes(item.id)
      );
      state.value = { ...state.value, collections: [...collections] };
    },
    addGlobal: (state, action) => {
      state.value = { ...state.value, global: [...action.payload] };
    },
    removeGlobalUpsellProduct: (state) => {
      state.value = { ...state.value, global: [] };
    },
    changeProductLoading: (state, action) => {
      state.value = { ...state.value, productLoading: action.payload };
    },
    changeCollectionLoading: (state, action) => {
      state.value = { ...state.value, collectionLoading: action.payload };
    },
    changeGlobalProductLoading: (state, action) => {
      state.value = { ...state.value, globalProductLoading: action.payload };
    },
    updateResourceAlreadyExist: (state, action) => {
      state.value = { ...state.value, resourceAlreadyExist: action.payload };
    },
  },
});

export const {
  addProductsIds,
  addCollectionsIds,
  removeProductsIds,
  removeProducts,
  removeCollectionsIds,
  removeCollections,
  addProducts,
  updateProductMetafield,
  addCollections,
  updateCollectionMetafield,
  updateRefetchCollection,
  updateRefetchProduct,
  addGlobal,
  removeGlobalUpsellProduct,
  changeProductLoading,
  changeCollectionLoading,
  changeGlobalProductLoading,
  updateResourceAlreadyExist,
} = upsellsSlice.actions;

export default upsellsSlice.reducer;
