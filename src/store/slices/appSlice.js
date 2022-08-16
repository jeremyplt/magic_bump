import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: { value: {} },
  reducers: {
    addCurrentAppInstallation: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    addGlobalUpsell: (state, action) => {
      state.value = {
        ...state.value,
        metafield: { value: action.payload.value, id: action.payload.id },
      };
    },
    removeGlobalUpsellId: (state) => {
      const newState = delete state.value.metafield;
      state = { ...newState };
    },
  },
});

export const {
  addCurrentAppInstallation,
  addGlobalUpsell,
  removeGlobalUpsellId,
} = appSlice.actions;

export default appSlice.reducer;
