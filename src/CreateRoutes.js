import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { PassivAccountContext } from "./contexts/passiv-account-provider";
import Overview from "./Overview";
import Login from "./Login";

// check to ensure we are logged in before navigating to a private page
function PrivateRoute({ children }) {
  const { isLoggedIn } = useContext(PassivAccountContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
}

//TODO: Is this the best way to do it? Or alteratively, should we do a check of state on the login page? This may be best.
// don't allow navigation to the login page if user is already authenticated
function AnonymousRoute({ children }) {
  const { isLoggedIn } = useContext(PassivAccountContext);
  return isLoggedIn ? <Navigate to="/" /> : children;
}

function CreateRoutes() {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <PrivateRoute>
            <Overview />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/login"
        element={
          <AnonymousRoute>
            <Login />
          </AnonymousRoute>
        }
      />
    </Routes>
  );
}
export default CreateRoutes;
