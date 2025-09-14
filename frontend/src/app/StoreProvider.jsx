"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/store";
// import { initializeCount } from '../lib/features/counter/counterSlice'

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
