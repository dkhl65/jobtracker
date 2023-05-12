import React, { useState, useEffect } from "react";
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

  const newJob = () => {
    setFormData(blankForm);
    setEditOpen(NEW);
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
      <Container maxWidth="lg" sx={{ marginTop: "10px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mb: "10px" }}>
            <TextField placeholder="Search…" />
          </Box>
          <Button variant="contained" onClick={newJob}>
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
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Application Date</TableCell>
                <TableCell>Technical Assessment Dates</TableCell>
                <TableCell>Interview Dates</TableCell>
                <TableCell>Rejection Date</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((row, key) => (
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
                      {row.location}
                    </a>
                  </TableCell>
                  <TableCell>{row.application || "Unknown"}</TableCell>
                  <TableCell>{row.assessment || "None"}</TableCell>
                  <TableCell>
                    {row.interview.replace(",", "\n") || "None"}
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Container>
      <Dialog open={editOpen !== CLOSED} onClose={() => setEditOpen(CLOSED)}>
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
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
          <Button onClick={() => setEditOpen(CLOSED)}>
            {editOpen === NEW ? "Add" : "Save"}
          </Button>
          <Button onClick={() => setEditOpen(CLOSED)}>Cancel</Button>
        </DialogActions>
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
        <DialogContentText>
            Are yous
          </DialogContentText>
      </Dialog>
    </LocalizationProvider>
  );
}

export default Jobs;
