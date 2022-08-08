import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: { value: {} },
  reducers: {
    addCurrentAppInstallation: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const { addCurrentAppInstallation } = appSlice.actions;

export default appSlice.reducer;
