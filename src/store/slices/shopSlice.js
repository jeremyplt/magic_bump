import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: { value: {} },
  reducers: {
    addShop: (state, action) => {
      state.value = { ...action.payload };
    },
  },
});

export const { addShop } = shopSlice.actions;

export default shopSlice.reducer;
