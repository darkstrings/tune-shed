import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import Router from "./router";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        {/* The PayPal SDK only loads on the order page, once we know the client id. */}
        <PayPalScriptProvider deferLoading options={{ clientId: "test", currency: "USD" }}>
          <Router />
        </PayPalScriptProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
