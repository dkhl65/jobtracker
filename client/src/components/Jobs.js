import React, { useState, useEffect, useRef, useMemo } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Container,
  Button,
  Toolbar,
  Box,
  TextField,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableSortLabel,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import JobDialogs from "./JobDialogs";
import NavBar from "./NavBar";

const NEW = -1;

function Jobs() {
  const axiosPrivate = useAxiosPrivate();
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [jobs, setJobs] = useState([]);
  const [dialogAction, setDialogAction] = useState({
    action: "none",
    jobNumber: NEW,
  });
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("application");
  const dialogRef = useRef();
  const visibleRows = useMemo(() => {
    jobs.sort((x, y) => {
      const a = x[orderBy].toLowerCase();
      const b = y[orderBy].toLowerCase();
      if ((a < b && order === "asc") || (a > b && order === "desc")) {
        return -1;
      }
      if ((a > b && order === "asc") || (a < b && order === "desc")) {
        return 1;
      }
      return 0;
    });
    return jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [jobs, page, rowsPerPage, order, orderBy]);

  const reloadJobs = () => {
    setLoadingJobs(true);
    setDialogAction({ action: "none", jobNumber: NEW });
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

  const changeOrder = (column, defaultOrder = "desc") => {
    if (orderBy === column && order === defaultOrder) {
      setOrder(defaultOrder === "desc" ? "asc" : "desc");
    } else {
      setOrder(defaultOrder);
    }
    setOrderBy(column);
  };

  useEffect(() => {
    reloadJobs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dialogAction.action === "new") {
      dialogRef.current.openNewForm();
    } else if (dialogAction.action === "edit") {
      dialogRef.current.openEditForm();
    } else if (dialogAction.action === "delete") {
      dialogRef.current.openDeleteForm();
    }
  }, [dialogAction]);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: "10px", mb: "10px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mb: "10px" }}>
            <TextField placeholder="Search…" />
          </Box>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, { label: "All", value: -1 }]}
            component="div"
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            showFirstButton
            showLastButton
          />
          <Button
            variant="contained"
            sx={{ ml: "10px" }}
            onClick={() => setDialogAction({ action: "new", jobNumber: NEW })}
          >
            Add Job
          </Button>
        </Toolbar>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "ghostwhite" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "company"}
                    direction={orderBy === "company" ? order : "asc"}
                    onClick={() => changeOrder("company", "asc")}
                  >
                    Company
                  </TableSortLabel>
                </TableCell>
                <TableCell>Location</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "application"}
                    direction={orderBy === "application" ? order : "desc"}
                    onClick={() => changeOrder("application")}
                  >
                    Application Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "assessment"}
                    direction={orderBy === "assessment" ? order : "desc"}
                    onClick={() => changeOrder("assessment")}
                  >
                    Technical Assessment Dates
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "interview"}
                    direction={orderBy === "interview" ? order : "desc"}
                    onClick={() => changeOrder("interview")}
                  >
                    Interview Dates
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "rejection"}
                    direction={orderBy === "rejection" ? order : "desc"}
                    onClick={() => changeOrder("rejection")}
                  >
                    Rejection Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a
                      href={`https://www.google.com/search?q=${row.company}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.company}
                    </a>
                  </TableCell>
                  <TableCell>
                    {row.location ? (
                      <>
                        <a
                          href={`https://maps.google.com/?q=${row.location}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {row.location}
                        </a>
                        {row.remote && " (Remote)"}
                      </>
                    ) : row.remote ? (
                      "Remote"
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell>{row.application || "Unknown"}</TableCell>
                  <TableCell>
                    {row.assessment.split(",").map((date, index) => (
                      <Box key={index}>{date || "None"}</Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    {row.interview.split(",").map((date, index) => (
                      <Box key={index}>{date || "None"}</Box>
                    ))}
                  </TableCell>
                  <TableCell>{row.rejection || "None"}</TableCell>
                  <TableCell>
                    {row.notes.split("\n").map((line, index) => (
                      <Box key={index}>{line || <br />}</Box>
                    ))}
                  </TableCell>
                  <TableCell width="120px">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() =>
                          setDialogAction({ action: "edit", jobNumber: index })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() =>
                          setDialogAction({
                            action: "delete",
                            jobNumber: index,
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {row.link && (
                      <Tooltip title="View job posting">
                        <IconButton
                          href={row.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LaunchIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loadingJobs === true && (
            <Alert severity="info">
              Loading your list of job applications...
            </Alert>
          )}
          {loadingJobs.length && (
            <Alert severity="error">
              Could not load your job applications. {loadingJobs}
            </Alert>
          )}
        </Box>
      </Container>
      <JobDialogs
        job={visibleRows[dialogAction.jobNumber]}
        ref={dialogRef}
        reloadJobs={reloadJobs}
      />
    </>
  );
}

export default Jobs;
