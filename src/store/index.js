import { configureStore } from "@reduxjs/toolkit";
import shopReducers from "./slices/shopSlice.js";
import upsellsReducers from "./slices/upsellsSlice.js";
import selectionReducers from "./slices/selectionSlice.js";
import pageTypeReducers from "./slices/pageTypeSlice.js";
import selectedUpsellsReducers from "./slices/selectedUpsellsSlice.js";
import toastReducers from "./slices/toastSlice.js";
import appReducers from "./slices/appSlice.js";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    shop: shopReducers,
    app: appReducers,
    upsells: upsellsReducers,
    selection: selectionReducers,
    toast: toastReducers,
    pageType: pageTypeReducers,
    selectedUpsells: selectedUpsellsReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
    }),
});

export default store;
