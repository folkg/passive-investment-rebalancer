import React, { useContext } from "react";
import { DarkModeContext } from "./contexts/theme.context";
import { Typography, AppBar, Toolbar, IconButton } from "@mui/material/";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function NavBar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography>Passiv App WIP</Typography>
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
