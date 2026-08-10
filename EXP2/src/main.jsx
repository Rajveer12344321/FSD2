// main.jsx
//
// Application entry point. Wraps the entire App in react-redux's <Provider>
// so every connected component (useSelector/useDispatch) can reach the store.

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
