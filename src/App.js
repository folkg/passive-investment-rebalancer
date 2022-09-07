import { PassivAccountProvider } from "./contexts/passiv-account-provider";
import { DarkModeProvider } from "./contexts/theme.context";
import { HoldingsProvider } from "./contexts/holdings.context";
import NavBar from "./NavBar";
import CreateRoutes from "./CreateRoutes";
import "./App.css";

function App() {
  const routes = CreateRoutes();
  return (
    <PassivAccountProvider>
      <DarkModeProvider>
        <HoldingsProvider>
          <NavBar />
          {routes}
        </HoldingsProvider>
      </DarkModeProvider>
    </PassivAccountProvider>
  );
}

export default App;
