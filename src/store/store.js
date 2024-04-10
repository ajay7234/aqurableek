import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import userPostReducer from "../redux/userPostSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userPost: userPostReducer,
  },
});
