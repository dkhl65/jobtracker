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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import NavBar from "./NavBar";

const CLOSED = -1;
const NEW = -2;

function Jobs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [jobs, setJobs] = useState([]);
  const [editOpen, setEditOpen] = useState(CLOSED);
  const [deleteOpen, setDeleteOpen] = useState(CLOSED);

  useEffect(() => {
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
    ];
    setJobs(temp);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NavBar />
      <Container sx={{ marginTop: "10px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mb: "10px" }}>
            <TextField placeholder="Search…" />
          </Box>
          <Button variant="contained" onClick={() => setEditOpen(NEW)}>
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
                  <TableCell>{row.interview || "None"}</TableCell>
                  <TableCell>{row.rejection || "None"}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditOpen(key)}>
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
      <Dialog open={editOpen !== -1} onClose={() => setEditOpen(CLOSED)}>
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
            defaultValue={(editOpen >= 0 && jobs[editOpen].company) || ""}
          />
          <TextField
            label="Location"
            fullWidth
            variant="standard"
            type="text"
            margin="dense"
            defaultValue={(editOpen >= 0 && jobs[editOpen].location) || ""}
          />
          <TextField
            label="Link to Job Post"
            fullWidth
            variant="standard"
            type="text"
            margin="dense"
            defaultValue={(editOpen >= 0 && jobs[editOpen].link) || ""}
          />
          <DatePicker
            format="YYYY-MM-DD"
            margin="dense"
            label="Application Date"
            defaultValue={
              (editOpen >= 0 &&
                jobs[editOpen].application.length > 0 &&
                dayjs(jobs[editOpen].application)) ||
              null
            }
            sx={{ mt: "15px", mr: "15px" }}
          />
          <DatePicker
            format="YYYY-MM-DD"
            margin="dense"
            label="Technical Assessment"
            defaultValue={
              (editOpen >= 0 &&
                jobs[editOpen].assessment.length > 0 &&
                dayjs(jobs[editOpen].assessment)) ||
              null
            }
            sx={{ mt: "15px" }}
          />
          <DatePicker
            format="YYYY-MM-DD"
            margin="dense"
            label="Interview Date"
            defaultValue={
              (editOpen >= 0 &&
                jobs[editOpen].interview.length > 0 &&
                dayjs(jobs[editOpen].interview)) ||
              null
            }
            sx={{ mt: "15px", mr: "15px" }}
          />
          <DatePicker
            format="YYYY-MM-DD"
            margin="dense"
            label="Rejection Date"
            defaultValue={
              (editOpen >= 0 &&
                jobs[editOpen].rejection.length > 0 &&
                dayjs(jobs[editOpen].rejection)) ||
              null
            }
            sx={{ mt: "15px" }}
          />
          <TextField
            label="Notes"
            variant="standard"
            type="text"
            margin="dense"
            defaultValue={(editOpen >= 0 && jobs[editOpen].notes) || null}
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
      </Dialog>
    </LocalizationProvider>
  );
}

export default Jobs;
