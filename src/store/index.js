import { configureStore } from "@reduxjs/toolkit";
import { rootReducers } from "./combineReducer";

export const store=configureStore({
  reducer:rootReducers
})
