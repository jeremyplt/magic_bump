import { createSlice } from "@reduxjs/toolkit";

const selectedUpsellsSlice = createSlice({
  name: "selectedUpsells",
  initialState: { value: {} },
  reducers: {
    addSelectedUpsells: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    removeSelectedUpsells: (state, action) => {
      const newState = { ...state.value };
      if (action.payload.length > 0)
        action.payload.forEach((id) => delete newState[id]);
      state.value = { ...newState };
    },
  },
});

export const { addSelectedUpsells, removeSelectedUpsells } =
  selectedUpsellsSlice.actions;

export default selectedUpsellsSlice.reducer;
