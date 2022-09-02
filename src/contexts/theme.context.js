import React, { useMemo, createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useLocalStorageToggleState from "../hooks/useLocalStorageToggleState";

export const DarkModeContext = createContext();

export function DarkModeProvider(props) {
  const [darkMode, toggleDarkMode] = useLocalStorageToggleState(
    "darkMode",
    false
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </DarkModeContext.Provider>
  );
}
