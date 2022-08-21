import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    value: {
      type: "",
      redirection: "",
    },
  },
  reducers: {
    addPageType: (state, action) => {
      state.value = action.payload;
    },
    addRedirectionPage: (state, action) => {
      state.value.redirection = action.payload;
    },
  },
});

export const { addPageType, addRedirectionPage } = pageSlice.actions;

export default pageSlice.reducer;
