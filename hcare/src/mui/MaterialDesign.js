import React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default function MuiProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export const MuiButton = styled(Button)`border-radius: 12px; text-transform: none;`;
export const MuiCard = styled(Card)`border-radius: 12px; padding: 12px;`;
export const MuiTextField = (props) => <TextField variant="outlined" size="small" {...props} />;
export const MuiAppBar = AppBar;
export const MuiToolbar = Toolbar;
