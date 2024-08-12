import { combineReducers } from "@reduxjs/toolkit";
import resetPasswordSlice from "./resetPasswordSlice";
import userLogSlice from "./userLogSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  resetPassword: resetPasswordSlice,
  userLogs: userLogSlice,
  userData: userSlice,
});

export default rootReducer;
