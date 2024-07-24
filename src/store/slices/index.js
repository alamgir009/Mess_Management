import { combineReducers } from "@reduxjs/toolkit";
import resetPasswordSlice from "./resetPasswordSlice";
import userLogSlice from "./userLogSlice";

const rootReducer = combineReducers({
  resetPassword: resetPasswordSlice,
  userLogs: userLogSlice,
});

export default rootReducer;
