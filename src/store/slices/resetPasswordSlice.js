import { createSlice } from "@reduxjs/toolkit";

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    userId: null,
  },
  reducers: {
    addUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { addUserId } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
