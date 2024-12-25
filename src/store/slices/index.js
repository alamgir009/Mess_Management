import { combineReducers } from "@reduxjs/toolkit";
import resetPasswordSlice from "./resetPasswordSlice";
import userLogSlice from "./userLogSlice";
import userSlice from "./userSlice";
import marketsSlice from "./marketSlice";

const rootReducer = combineReducers({
  resetPassword: resetPasswordSlice,
  userLogs: userLogSlice,
  userData: userSlice,
  marketData: marketsSlice,
});

export default rootReducer;
