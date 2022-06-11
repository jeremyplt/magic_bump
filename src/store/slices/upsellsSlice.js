import { createSlice } from "@reduxjs/toolkit";

const upsellsSlice = createSlice({
  name: "upsells",
  initialState: { value: {} },
  reducers: {
    addUpsells: (state, action) => {
      state.value = { ...action.payload };
    },
  },
});

export const { addUpsells } = upsellsSlice.actions;

export default upsellsSlice.reducer;
