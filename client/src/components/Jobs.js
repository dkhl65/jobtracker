import React from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { Typography, Container, Button } from "@mui/material";

function Jobs() {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Typography component="h1" variant="h1" align="center">
        Welcome
      </Typography>
      <Button variant="contained" onClick={(e) => signOut()}>
        Sign Out
      </Button>
    </Container>
  );
}

export default Jobs;
