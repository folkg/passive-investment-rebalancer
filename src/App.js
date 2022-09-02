import { PassivAccountProvider } from "./contexts/passiv-account-provider";
import CreateRoutes from "./CreateRoutes";
import "./App.css";

function App() {
  const routes = CreateRoutes();
  return <PassivAccountProvider>{routes}</PassivAccountProvider>;
}

export default App;
