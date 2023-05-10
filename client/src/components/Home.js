import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "../api/axios";

function Home() {
  const { setAuth, persist, setPersist } = useAuth();
  const [hasAccount, setHasAccount] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const refresh = useRefreshToken();
  const from = location.state?.from?.pathname || "/jobs";

  const [user, setUser] = useState("");
  const [confirmUser, setConfirmUser] = useState("");
  const [userErrMsg, setUserErrMsg] = useState("");
  const [confirmUserErrMsg, setConfirmUserErrMsg] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdErrMsg, setPwdErrMsg] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [confirmPwdErrMsg, setConfirmPwdErrMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    setUser(user.trim().toLowerCase());
    setConfirmUser(confirmUser.trim().toLowerCase());
    if (
      user.length === 0 ||
      pwd.length === 0 ||
      (!hasAccount &&
        (user.trim().toLowerCase() !== confirmUser.trim().toLowerCase() ||
          pwd !== confirmPwd))
    ) {
      return;
    }

    try {
      setWaiting(true);
      const response = await axios.post(
        hasAccount ? "/auth" : "/register",
        JSON.stringify({ user: user.trim().toLowerCase(), pwd: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      if (hasAccount) {
        setAuth({ user, pwd, accessToken });
      }
      setUser("");
      setPwd("");
      setConfirmUser("");
      setConfirmPwd("");
      if (hasAccount) {
        navigate(from, { replace: true });
      } else {
        // return to login form with success message
        setRegistered(true);
        setHasAccount(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response.");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing username or password.");
      } else if (err.response?.status === 401) {
        setErrMsg("Wrong username or password.");
      } else if (err.response?.status === 409) {
        setErrMsg("Please choose another username.");
        setUserErrMsg("Username taken.");
      } else {
        setErrMsg("Failed");
      }
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, hasAccount]);

  useEffect(() => {
    refresh()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container maxWidth="sm">
      <Typography component="h1" variant="h1" align="center">
        Job Tracking
      </Typography>
      <Typography>
        Record applied jobs, interviews and rejections. View analytics on them,
        such as interview rate and applications per day. Good luck!
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {hasAccount ? "Sign in" : "Sign up"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            error={!hasAccount && userErrMsg.length > 0}
            helperText={!hasAccount && userErrMsg}
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setUserErrMsg("");
              setConfirmUserErrMsg("");
            }}
            onBlur={(e) => {
              if (
                confirmUser.length > 0 &&
                confirmUser.trim().toLowerCase() !== user.trim().toLowerCase()
              ) {
                setConfirmUserErrMsg("Usernames do not match.");
              }
            }}
            autoFocus
          />
          {!hasAccount && (
            <TextField
              margin="normal"
              required={!hasAccount}
              fullWidth
              id="confirm-username"
              label="Confirm Username"
              name="confirm-username"
              autoComplete="off"
              error={confirmUserErrMsg.length > 0}
              helperText={confirmUserErrMsg}
              value={confirmUser}
              onChange={(e) => {
                setConfirmUser(e.target.value);
                setConfirmUserErrMsg("");
              }}
              onBlur={(e) => {
                if (
                  confirmUser.trim().toLowerCase() !== user.trim().toLowerCase()
                ) {
                  setConfirmUserErrMsg("Usernames do not match.");
                }
              }}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!hasAccount && pwdErrMsg.length > 0}
            helperText={!hasAccount && pwdErrMsg}
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setPwdErrMsg("");
              setConfirmPwdErrMsg("");
            }}
            onBlur={() => {
              if (confirmPwd.length > 0 && confirmPwd !== pwd) {
                setConfirmPwdErrMsg("Passwords do not match.");
              }
            }}
          />
          {!hasAccount && (
            <TextField
              margin="normal"
              required={!hasAccount}
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="off"
              error={confirmPwdErrMsg.length > 0}
              helperText={confirmPwdErrMsg}
              value={confirmPwd}
              onChange={(e) => {
                setConfirmPwd(e.target.value);
                setConfirmPwdErrMsg("");
              }}
              onBlur={(e) => {
                if (confirmPwd !== pwd) {
                  setConfirmPwdErrMsg("Passwords do not match.");
                }
              }}
            />
          )}
          {hasAccount && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={persist}
                  onChange={(e) => setPersist(e.target.checked)}
                />
              }
              label="Stay logged in."
            />
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => setHasAccount(!hasAccount)}
              >
                {hasAccount ? "Need an account?" : "Have an account?"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  pwd.length === 0 ||
                  user.length === 0 ||
                  (!hasAccount &&
                    (pwd !== confirmPwd ||
                      user.trim().toLowerCase() !==
                        confirmUser.trim().toLowerCase()))
                }
                sx={{ mt: 3, mb: 2 }}
              >
                {hasAccount ? "Sign in" : "Sign up"}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {errMsg.length > 0 && <Alert severity="error">{errMsg}</Alert>}
        {waiting && (
          <Alert severity="info">
            {hasAccount ? "Signing in..." : "Signing up..."}
          </Alert>
        )}
        {registered && (
          <Alert severity="success">
            Your account has been registered! Please sign in.
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default Home;
