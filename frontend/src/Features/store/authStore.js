import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../state/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
