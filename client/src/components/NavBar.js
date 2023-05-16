import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Typography,
  Container,
  Button,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";

function NavBar() {
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation().pathname;
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState("");

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    axiosPrivate.get("/user").then((res) => {
      setUser(res.data);
    });
  }, [axiosPrivate]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant={location === "/jobs" ? "outlined" : ""}
              color="inherit"
              onClick={() => navigate("/jobs")}
            >
              Job List
            </Button>
            <Button
              variant={location === "/calendar" ? "outlined" : ""}
              color="inherit"
              onClick={() => navigate("/calendar")}
            >
              Calendar
            </Button>
          </Box>
          <Typography variant="h6" component="div" sx={{ marginRight: "10px" }}>
            {user}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            onClick={(e) => signOut()}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
