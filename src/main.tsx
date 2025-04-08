import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createTheme, ThemeProvider } from "@mui/material";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const theme = createTheme({
  typography: {
    fontFamily: "Play",
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
