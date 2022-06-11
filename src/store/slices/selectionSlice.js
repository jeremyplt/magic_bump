import { createSlice } from "@reduxjs/toolkit";

const selectionSlice = createSlice({
  name: "selection",
  initialState: { value: [] },
  reducers: {
    addSelection: (state, action) => {
      state.value = [...action.payload];
    },
    removeSelection: (state) => {
      state.value = [];
    },
  },
});

export const { addSelection, removeSelection } = selectionSlice.actions;

export default selectionSlice.reducer;
