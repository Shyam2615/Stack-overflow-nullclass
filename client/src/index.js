import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import {createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import Reducers from "./reducers";
import { AuthProvider } from './store/auth.jsx'

const root = ReactDOM.createRoot(document.getElementById("root"));
const store = createStore( Reducers, compose(applyMiddleware(thunk)));


root.render(
  <AuthProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </AuthProvider>
);