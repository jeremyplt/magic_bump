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
    removeGlobalUpsell: (state) => {
      const newState = delete state.value.metafield;
      state = { ...newState };
    },
  },
});

export const {
  addCurrentAppInstallation,
  addGlobalUpsell,
  removeGlobalUpsell,
} = appSlice.actions;

export default appSlice.reducer;
