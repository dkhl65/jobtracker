import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import JobList from "./JobList";
import Calendar from "./Calendar";
import useLogout from "../hooks/useLogout";
import {
  Typography,
  Container,
  Button,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";

function Jobs() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [location, setLocation] = useState("joblist");
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobs, setJobs] = useState([]);

  const reloadJobs = () => {
    setLoadingJobs(true);
    axiosPrivate
      .get("/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoadingJobs(false);
      })
      .catch((err) => {
        if (!err?.response) {
          setLoadingJobs("No server response.");
        } else if (err.response?.status === 500) {
          setLoadingJobs(
            `Internal server error: ${
              err.response.data?.name || "unknown error"
            }. Please try again later.`
          );
        } else {
          setLoadingJobs(err.message);
        }
      });
  };

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    reloadJobs();
    axiosPrivate.get("/user").then((res) => {
      setUser(res.data);
    });
  }, [axiosPrivate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Button
                variant={location === "joblist" ? "outlined" : ""}
                color="inherit"
                onClick={() => setLocation("joblist")}
              >
                Job List
              </Button>
              <Button
                variant={location === "calendar" ? "outlined" : ""}
                color="inherit"
                onClick={() => setLocation("calendar")}
              >
                Calendar
              </Button>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ marginRight: "10px" }}
            >
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
      {location === "joblist" && (
        <JobList
          jobs={jobs}
          loadingJobs={loadingJobs}
          reloadJobs={reloadJobs}
        />
      )}
      {location === "calendar" && (
        <Calendar jobs={jobs} loadingJobs={loadingJobs} />
      )}
    </>
  );
}

export default Jobs;
