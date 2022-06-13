import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: { value: false },
  reducers: {
    toggleActive: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleActive } = toastSlice.actions;

export default toastSlice.reducer;
