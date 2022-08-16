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
      const newState = [...state.value.products, ...action.payload];
      const products = Array.from(new Set(newState.map((a) => a.id))).map(
        (id) => {
          return newState.find((a) => a.id === id);
        }
      );
      state.value = { ...state.value, products: [...products] };
    },
    addCollections: (state, action) => {
      const newState = [...state.value.collections, ...action.payload];
      const collections = Array.from(new Set(newState.map((a) => a.id))).map(
        (id) => {
          return newState.find((a) => a.id === id);
        }
      );
      state.value = { ...state.value, collections: [...collections] };
    },
    addGlobal: (state, action) => {
      state.value = { ...state.value, global: [...action.payload] };
    },
    removeGlobalUpsellProduct: (state) => {
      state.value = { ...state.value, global: [null] };
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
  },
});

export const {
  addProductsIds,
  addCollectionsIds,
  removeProductsIds,
  addProducts,
  addCollections,
  addGlobal,
  removeGlobalUpsellProduct,
  changeProductLoading,
  changeCollectionLoading,
  changeGlobalProductLoading,
} = upsellsSlice.actions;

export default upsellsSlice.reducer;
