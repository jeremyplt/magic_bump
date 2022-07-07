import { createSlice } from "@reduxjs/toolkit";

const upsellsSlice = createSlice({
  name: "upsells",
  initialState: {
    value: {
      products: [],
      collections: [],
    },
  },
  reducers: {
    addProducts: (state, action) => {
      const products = [
        ...new Set([...state.value.products, ...action.payload]),
      ];
      state.value = {
        ...state.value,
        products: products,
      };
    },
    addCollections: (state, action) => {
      const collections = [
        ...new Set([...state.value.collections, ...action.payload]),
      ];
      state.value = { ...state.value, collections: collections };
    },
  },
});

export const { addProducts, addCollections } = upsellsSlice.actions;

export default upsellsSlice.reducer;
