import { createSlice } from "@reduxjs/toolkit";

const userLogSlice = createSlice({
  name: "userLogs",
  initialState: {
    userLog: "logOut",
  },
  reducers: {
    login: (state, action) => {
      state.userLog = action.payload;
    },
    logout: (state, action) => {
      state.userLog = action.payload;
    },
  },
});

export const { login, logout } = userLogSlice.actions;

export default userLogSlice.reducer;
