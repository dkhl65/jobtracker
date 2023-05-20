import React, { useState, useEffect, useMemo } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Container,
  Button,
  Toolbar,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import NavBar from "./NavBar";

const NEW = -1;
const blankForm = {
  company: "",
  location: "",
  link: "",
  remote: false,
  application: "",
  assessment: [""],
  interview: [""],
  rejection: "",
  notes: "",
};

function Jobs() {
  const axiosPrivate = useAxiosPrivate();
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [jobs, setJobs] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(NEW);
  const [formData, setFormData] = useState(blankForm);
  const [formMessage, setFormMessage] = useState({ error: false, message: "" });
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("application");
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

  const reload = () => {
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

  const changeOrder = (column, defaultOrder = "desc") => {
    if (orderBy === column && order === defaultOrder) {
      setOrder(defaultOrder === "desc" ? "asc" : "desc");
    } else {
      setOrder(defaultOrder);
    }
    setOrderBy(column);
  };

  const openEditForm = (jobNumber) => {
    const newForm = {
      ...visibleRows[jobNumber],
      assessment: visibleRows[jobNumber].assessment.split(","),
      interview: visibleRows[jobNumber].interview.split(","),
    };
    setFormData(newForm);
    setEditOpen(true);
    setSelectedJob(jobNumber);
  };

  const saveJob = async (e) => {
    e.preventDefault();
    if (formMessage.message.length > 0) {
      return;
    }
    const jobApp = {
      ...formData,
      company: formData.company.trim(),
      location: formData.location.trim(),
      link: formData.link.trim(),
      assessment: formData.assessment
        .filter((date) => date.length > 0 && date.indexOf("Invalid Date") < 0)
        .join(","),
      interview: formData.interview
        .filter((date) => date.length > 0 && date.indexOf("Invalid Date") < 0)
        .join(","),
      notes: formData.notes.trim(),
    };
    try {
      if (selectedJob === NEW) {
        setFormMessage({ error: false, message: "Adding job application..." });
        await axiosPrivate.post("/jobs", jobApp);
      } else {
        setFormMessage({ error: false, message: "Saving..." });
        await axiosPrivate.put("/jobs", jobApp);
      }
      setEditOpen(false);
      reload();
    } catch (err) {
      if (!err?.response) {
        setFormMessage({ error: true, message: "No server response." });
      } else if (err.response?.status === 500) {
        setFormMessage({
          error: true,
          message: `Internal server error: ${
            err.response.data?.name || "unknown error"
          }. Please try again later.`,
        });
      } else {
        setFormMessage({
          error: true,
          message: err.response?.data?.message || err.message,
        });
      }
    }
  };

  const deleteJob = (e) => {
    e.preventDefault();
    if (formMessage.message.length > 0 || !jobs[selectedJob]?.id) {
      return;
    }
    setFormMessage({ error: false, message: "Deleting job application..." });
    axiosPrivate
      .delete("/jobs", { data: { id: jobs[selectedJob].id } })
      .then(() => {
        setDeleteOpen(false);
        setSelectedJob(NEW);
        reload();
      })
      .catch((err) => {
        if (!err?.response) {
          setFormMessage({ error: true, message: "No server response." });
        } else if (err.response?.status === 500) {
          setFormMessage({
            error: true,
            message: `Internal server error: ${
              err.response.data?.name || "unknown error"
            }. Please try again later.`,
          });
        } else {
          setFormMessage({
            error: true,
            message: err.response?.data?.message || err.message,
          });
        }
      });
  };

  useEffect(() => {
    setFormMessage({ error: false, message: "" });
  }, [editOpen, deleteOpen]);

  useEffect(() => {
    reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: "10px", mb: "10px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mb: "10px" }}>
            <TextField placeholder="Search…" />
          </Box>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
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
            onClick={() => {
              setFormData(JSON.parse(JSON.stringify(blankForm)));
              setSelectedJob(NEW);
              setEditOpen(true);
            }}
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
                      <IconButton onClick={() => openEditForm(index)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          setSelectedJob(index);
                          setDeleteOpen(true);
                        }}
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
      <Dialog
        open={editOpen}
        onClose={() => {
          if (formMessage.error || formMessage.message.length === 0) {
            setEditOpen(false);
          }
        }}
      >
        <Box component="form" onSubmit={saveJob}>
          <DialogTitle>
            {(selectedJob >= 0 &&
              `Edit ${jobs[selectedJob]?.company} Application`) ||
              "Add Job"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Company"
              fullWidth
              variant="standard"
              type="text"
              margin="dense"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              inputProps={{ maxLength: 255 }}
              required
            />
            <TextField
              label="Location"
              fullWidth
              variant="standard"
              type="text"
              margin="dense"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              inputProps={{ maxLength: 255 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.remote}
                  onChange={(e) =>
                    setFormData({ ...formData, remote: e.target.checked })
                  }
                />
              }
              label="Remote"
            />
            <TextField
              label="Link to Job Post"
              fullWidth
              variant="standard"
              type="url"
              margin="dense"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              inputProps={{ maxLength: 255 }}
            />
            <DatePicker
              format="YYYY-MM-DD"
              margin="dense"
              label="Application Date"
              value={
                formData.application.length > 0
                  ? dayjs(formData.application)
                  : null
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  application: e ? e.format("YYYY-MM-DD") : "",
                })
              }
              sx={{ mt: "15px", mr: "15px" }}
            />
            <br />
            {formData.assessment.map((value, index) => (
              <Box key={index}>
                <DatePicker
                  format="YYYY-MM-DD"
                  margin="dense"
                  label={`Technical Assessment ${index + 1}`}
                  value={value.length > 0 ? dayjs(value) : null}
                  onChange={(e) => {
                    formData.assessment[index] = e
                      ? e.format("YYYY-MM-DD")
                      : "";
                    setFormData({ ...formData });
                  }}
                  sx={{ mt: "15px" }}
                />
                {formData.assessment.length > 1 && (
                  <Tooltip title="Remove technical assessment date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.assessment.splice(index, 1);
                        setFormData({ ...formData });
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {Number(index) === formData.assessment.length - 1 && (
                  <Tooltip title="Add another technical assessment date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.assessment.push("");
                        setFormData({ ...formData });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <br />
              </Box>
            ))}
            {formData.interview.map((value, index) => (
              <Box key={index}>
                <DatePicker
                  format="YYYY-MM-DD"
                  margin="dense"
                  label={`Interview ${index + 1}`}
                  value={value.length > 0 ? dayjs(value) : null}
                  onChange={(e) => {
                    formData.interview[index] = e ? e.format("YYYY-MM-DD") : "";
                    setFormData({ ...formData });
                  }}
                  sx={{ mt: "15px" }}
                />
                {formData.interview.length > 1 && (
                  <Tooltip title="Remove interview date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.interview.splice(index, 1);
                        setFormData({ ...formData });
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {Number(index) === formData.interview.length - 1 && (
                  <Tooltip title="Add another interview date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.interview.push("");
                        setFormData({ ...formData });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <br />
              </Box>
            ))}
            <DatePicker
              format="YYYY-MM-DD"
              margin="dense"
              label="Rejection Date"
              value={
                formData.rejection.length > 0 ? dayjs(formData.rejection) : null
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rejection: e ? e.format("YYYY-MM-DD") : "",
                })
              }
              sx={{ mt: "15px" }}
            />
            <br />
            <TextField
              label="Notes"
              variant="standard"
              type="text"
              margin="dense"
              defaultValue={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              inputProps={{ maxLength: 1000 }}
              fullWidth
              multiline
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">
              {selectedJob === NEW ? "Add" : "Save"}
            </Button>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          </DialogActions>
          {formMessage.message.length > 0 && (
            <Alert severity={formMessage.error ? "error" : "info"}>
              {formMessage.message}
            </Alert>
          )}
        </Box>
      </Dialog>
      <Dialog
        open={deleteOpen}
        onClose={() => {
          if (formMessage.error || formMessage.message.length === 0) {
            setDeleteOpen(false);
          }
        }}
      >
        <DialogTitle>
          Delete {selectedJob >= 0 && jobs[selectedJob].company} Application
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your application to{" "}
            {selectedJob >= 0 && jobs[selectedJob].company}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteJob}>Yes</Button>
          <Button onClick={() => setDeleteOpen(false)}>No</Button>
        </DialogActions>
        {formMessage.message.length > 0 && (
          <Alert severity={formMessage.error ? "error" : "info"}>
            {formMessage.message}
          </Alert>
        )}
      </Dialog>
    </LocalizationProvider>
  );
}

export default Jobs;
