import React from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
import "./index.module.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import MyErrorBoundary from "./utils/ErrorFallback";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <MyErrorBoundary>
      <App tab="home" />
    </MyErrorBoundary>
  </Provider>
);
