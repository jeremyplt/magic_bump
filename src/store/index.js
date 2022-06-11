import { configureStore } from "@reduxjs/toolkit";
import shopReducers from "./slices/shopSlice.js";
import upsellsReducers from "./slices/upsellsSlice.js";
import selectionReducers from "./slices/selectionSlice.js";
import pageTypeReducers from "./slices/pageTypeSlice.js";
import selectedUpsellsReducers from "./slices/selectedUpsellsSlice.js";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    shop: shopReducers,
    upsells: upsellsReducers,
    selection: selectionReducers,
    pageType: pageTypeReducers,
    selectedUpsells: selectedUpsellsReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
    }),
});

export default store;
