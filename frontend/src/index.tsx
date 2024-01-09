import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme";
import {BrowserRouter} from "react-router-dom";
import {Home} from "./Home";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Home/>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

