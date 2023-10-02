import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/user/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
