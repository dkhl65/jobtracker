import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Button,
  Toolbar,
  Box,
  TextField,
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

const CLOSED = -1;
const NEW = -2;
const blankForm = {
  company: "",
  location: "",
  link: "",
  application: "",
  assessment: [""],
  interview: [""],
  rejection: "",
  notes: "",
};

function Jobs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [jobs, setJobs] = useState([]);
  const [editOpen, setEditOpen] = useState(CLOSED);
  const [deleteOpen, setDeleteOpen] = useState(CLOSED);
  const [formData, setFormData] = useState(blankForm);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("application");
  const visibleRows = useMemo(() => {
    jobs.sort((x, y) => {
      const a = x[orderBy].toString();
      const b = y[orderBy].toString();
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

  const changeOrder = (column, defaultOrder = "desc") => {
    if (orderBy === column && order === defaultOrder) {
      setOrder(defaultOrder === "desc" ? "asc" : "desc");
    } else {
      setOrder(defaultOrder);
    }
    setOrderBy(column);
  };

  const editJob = (jobNumber) => {
    const newForm = { ...jobs[jobNumber] };
    newForm.assessment = jobs[jobNumber].assessment
      .split(",")
      .map((item) => item.trim());
    newForm.interview = jobs[jobNumber].interview
      .split(",")
      .map((item) => item.trim());
    setFormData(newForm);
    setEditOpen(jobNumber);
  };

  const refresh = () => {
    const temp = [
      {
        company: "Konrad",
        location: "469 King St W, Floor 2, Toronto",
        application: "2022-01-05",
        assessment: "",
        interview: "",
        rejection: "",
        notes: "There is a lot of text.",
        link: "https://boards.greenhouse.io/konradgroup/jobs/4806453003?gh_src=a742e8c03us",
      },
      {
        company: "3rdwave",
        location: "225 Duncan Mill Rd, North York, ON M3B 3K9",
        application: "2022-01-31",
        assessment: "",
        interview: "2022-02-07",
        rejection: "2022-02-15",
        notes: "The job is far away.",
        link: "",
      },
      {
        company: "EllisDon",
        location: "1004 Middlegate Rd, Mississauga, Ontario L4Y",
        application: "2022-05-08",
        assessment: "",
        interview: "2022-05-19,2022-05-25",
        rejection: "2022-05-26",
        notes: "",
        link: "https://recruiting.ultipro.ca/ELL5000/JobBoard/fa7dd324-0b16-f8cb-f544-f46b499e5db7/OpportunityDetail?opportunityId=51c5850a-46bf-4307-afdc-7ac9fbf4b411&utm_source=LINKEDIN&utm_medium=referrer",
      },
    ];
    setJobs(temp);
  };

  useEffect(() => {
    refresh();
  }, []);

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
              setFormData(blankForm);
              setEditOpen(NEW);
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
            <TableHead sx={{ position: "sticky" }}>
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
              {visibleRows.map((row, key) => (
                <TableRow key={key}>
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
                    <a
                      href={`https://maps.google.com/?q=${row.location}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.location || "Unknown"}
                    </a>
                  </TableCell>
                  <TableCell>{row.application || "Unknown"}</TableCell>
                  <TableCell>{row.assessment || "None"}</TableCell>
                  <TableCell>
                    {row.interview.split(",").map((date, index) => (
                      <Box key={index}>{date || "None"}</Box>
                    ))}
                  </TableCell>
                  <TableCell>{row.rejection || "None"}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell width="120px">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => editJob(key)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => setDeleteOpen(key)}>
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
      </Container>
      <Dialog open={editOpen !== CLOSED} onClose={() => setEditOpen(CLOSED)}>
        <Box component="form" onSubmit={(e) => e.preventDefault()}>
          <DialogTitle>
            {(editOpen >= 0 && `Edit ${jobs[editOpen].company} Application`) ||
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
            />
            <TextField
              label="Link to Job Post"
              fullWidth
              variant="standard"
              type="text"
              margin="dense"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
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
                  application: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : "",
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
                      ? `${e.$y}-${e.$M + 1}-${e.$D}`
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
                    formData.interview[index] = e
                      ? `${e.$y}-${e.$M + 1}-${e.$D}`
                      : "";
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
                  rejection: e ? `${e.$y}-${e.$M + 1}-${e.$D}` : "",
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
              fullWidth
              multiline
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">{editOpen === NEW ? "Add" : "Save"}</Button>
            <Button onClick={() => setEditOpen(CLOSED)}>Cancel</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={deleteOpen >= 0} onClose={() => setDeleteOpen(CLOSED)}>
        <DialogTitle>
          Delete {deleteOpen >= 0 && jobs[deleteOpen].company} Application
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your application to{" "}
            {deleteOpen >= 0 && jobs[deleteOpen].company}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(CLOSED)}>Yes</Button>
          <Button onClick={() => setDeleteOpen(CLOSED)}>No</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default Jobs;
