import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PassivAccountContext } from "./contexts/passiv-account-provider";

import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

//TODO: Redirect to new page for accounts if login is successful
function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const { login, getAccounts, getAPIStatus, verifyTokenStatus, isLoggedIn } =
    useContext(PassivAccountContext);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const success = await login(data.get("email"), data.get("password"));
    if (success) {
      setLoginError(false);
      navigate("/accounts", { replace: true });
    } else {
      setLoginError(true);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {loginError && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              Email / Password entered is incorrect. Please re-try.
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {isLoggedIn && <div>User is already logged in</div>}
          <Button onClick={getAccounts}>Get Accounts</Button>
          <Button onClick={getAPIStatus}>Get API Status</Button>
          <Button onClick={verifyTokenStatus}>Verify Token Status</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
