import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, Link } from "react-router-dom";
import JobList from "./JobList";
import Calendar from "./Calendar";
import Statistics from "./Statistics";
import useLogout from "../hooks/useLogout";
import {
  Typography,
  Container,
  Button,
  AppBar,
  Toolbar,
  Box,
  Tooltip,
} from "@mui/material";

function Jobs() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [location, setLocation] = useState("Job List");
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
        } else if (err.response?.status === 401) {
          setLoadingJobs("Your session has expired. Please refresh the page.");
        } else {
          setLoadingJobs(err.message);
        }
      });
  };

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const LinkButton = ({ pageName }) => {
    return (
      <Button
        variant={location === pageName ? "outlined" : ""}
        color="inherit"
        onClick={() => setLocation(pageName)}
      >
        {pageName}
      </Button>
    );
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
              <LinkButton pageName="Job List" />
              <LinkButton pageName="Calendar" />
              <LinkButton pageName="Statistics" />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ marginRight: "10px" }}
            >
              <Tooltip title="Account Settings">
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/account"
                >
                  {user}
                </Link>
              </Tooltip>
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
      {location === "Job List" && (
        <JobList
          jobs={jobs}
          loadingJobs={loadingJobs}
          reloadJobs={reloadJobs}
        />
      )}
      {location === "Calendar" && (
        <Calendar jobs={jobs} loadingJobs={loadingJobs} />
      )}
      {location === "Statistics" && (
        <Statistics jobs={jobs} loadingJobs={loadingJobs} />
      )}
    </>
  );
}

export default Jobs;
