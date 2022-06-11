import { createSlice } from "@reduxjs/toolkit";

const pageTypeSlice = createSlice({
  name: "pageType",
  initialState: { value: "" },
  reducers: {
    addPageType: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addPageType } = pageTypeSlice.actions;

export default pageTypeSlice.reducer;
