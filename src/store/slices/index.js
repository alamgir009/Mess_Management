import { combineReducers } from "@reduxjs/toolkit";
import resetPasswordSlice from "./resetPasswordSlice";

const rootReducer = combineReducers({
  resetPassword: resetPasswordSlice,
});

export default rootReducer;
