import { PassivAccountProvider } from "./contexts/passiv-account-provider";
import { DarkModeProvider } from "./contexts/theme.context";
import NavBar from "./NavBar";
import CreateRoutes from "./CreateRoutes";
import "./App.css";

function App() {
  const routes = CreateRoutes();
  return (
    <PassivAccountProvider>
      <DarkModeProvider>
        <NavBar />
        {routes}
      </DarkModeProvider>
    </PassivAccountProvider>
  );
}

export default App;
