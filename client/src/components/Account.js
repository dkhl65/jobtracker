import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import {
  Typography,
  Container,
  Button,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Account() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const [user, setUser] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPwdError, setOldPwdError] = useState("");
  const [newPwdError, setNewPwdError] = useState("");
  const [confirmPwdError, setConfirmPwdError] = useState("");
  const [serverError, setServerError] = useState("");
  const [waiting, setWaiting] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    setServerError("");
    if (
      oldPassword.length * newPassword.length * confirmPassword.length ===
      0
    ) {
      return;
    }
    if (newPassword === oldPassword) {
      setNewPwdError("Password is not new.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPwdError("New passwords do not match.");
      return;
    }

    try {
      setWaiting(true);
      setPasswordChanged(false);
      await axiosPrivate.put("/user", { oldPassword, newPassword });
      setPasswordChanged(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (!err?.response) {
        setServerError("No server response.");
      } else if (err.response?.status === 400) {
        setServerError("Missing old password or new password.");
      } else if (err.response?.status === 401) {
        setServerError("Wrong password.");
        setOldPwdError("Wrong password.");
      } else if (err.response?.status === 500) {
        setServerError(
          `Internal server error: ${
            err.response.data?.name || "unknown error"
          }. Please try again later.`
        );
      } else {
        setServerError(err.message);
      }
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    setNewPwdError("");
    setConfirmPwdError("");
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setNewPwdError("");
  }, [newPassword, oldPassword]);

  useEffect(() => {
    axiosPrivate
      .get("/user")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setUser("Session expired. Please refresh the page.");
        }
      });
  }, [axiosPrivate]);

  return (
    <Container maxWidth="sm">
      <Typography component="h2" variant="h2" align="center">
        Account Settings
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h4" variant="h4">
          Username
        </Typography>
        <Typography component="h5" variant="h5">
          {user}
        </Typography>
        <Button variant="contained" onClick={signOut} sx={{ mt: 1, mb: 2 }}>
          Log Out
        </Button>
        <Typography component="h4" variant="h4">
          Change Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleNewPassword}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            margin="normal"
            type="password"
            required
            fullWidth
            label="Current Password"
            error={oldPwdError.length > 0}
            helperText={oldPwdError}
            value={oldPassword}
            onChange={(e) => {
              setOldPwdError("");
              setOldPassword(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="New Password"
            error={newPwdError.length > 0}
            helperText={newPwdError}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Confirm Password"
            autoComplete="off"
            error={confirmPwdError.length > 0}
            helperText={confirmPwdError}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
            Change Password
          </Button>
        </Box>
        {waiting && <Alert severity="info">Changing password...</Alert>}
        {passwordChanged && (
          <Alert severity="success">Password has been changed.</Alert>
        )}
        {serverError.length > 0 && (
          <Alert severity="error">{serverError}</Alert>
        )}
        <Link to="/jobs">
          <Button color="secondary" variant="contained" sx={{ mt: 2 }}>
            Return to Job List
          </Button>
        </Link>
      </Box>
    </Container>
  );
}

export default Account;
