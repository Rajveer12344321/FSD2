// app/store.js
//
// Central Redux Toolkit store (Experiment 2.1, section "Configure Redux store").
// configureStore combines both slices into a single source of truth and
// wires up Redux DevTools + the default middleware (including serializability
// checks) automatically -- no manual store.js boilerplate required.

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import platformsReducer from "../features/platforms/platformSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer
  }
});

export default store;
