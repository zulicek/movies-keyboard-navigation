"use client";

import { configureStore } from "@reduxjs/toolkit";
import itemReducer from './itemsSlice'
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    items: itemReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
