import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  forwardRef,
  useImperativeHandle,
} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const blankForm = {
  company: "",
  location: "",
  link: "",
  remote: false,
  application: dayjs().format("YYYY-MM-DD"),
  assessment: [""],
  interview: [""],
  decision: "",
  offered: false,
  notes: "",
};

const JobDialogs = forwardRef((props, ref) => {
  const { job, reloadJobs } = props;
  const axiosPrivate = useAxiosPrivate();
  const formData = useRef(JSON.parse(JSON.stringify(blankForm)));
  const [, update] = useReducer((x) => x + 1, 0);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMessage, setFormMessage] = useState({ error: false, message: "" });
  const [newJob, setNewJob] = useState(true);

  useImperativeHandle(ref, () => ({
    openEditForm() {
      const newForm = {
        ...job,
        assessment: job.assessment.split(","),
        interview: job.interview.split(","),
      };
      formData.current = newForm;
      setNewJob(false);
      setEditOpen(true);
    },
    openNewForm() {
      formData.current = JSON.parse(JSON.stringify(blankForm));
      setNewJob(true);
      setEditOpen(true);
    },
    openDeleteForm() {
      setDeleteOpen(true);
    },
  }));

  useEffect(() => {
    setFormMessage({ error: false, message: "" });
  }, [editOpen, deleteOpen]);

  const saveJob = async (e) => {
    e.preventDefault();
    if (formMessage.message.length > 0) {
      return;
    }
    if (
      (
        formData.current.application +
        formData.current.assessment.toString() +
        formData.current.interview.toString() +
        formData.current.decision
      ).indexOf("Invalid Date") >= 0
    ) {
      return;
    }

    const jobApp = {
      ...formData.current,
      company: formData.current.company.trim(),
      location: formData.current.location.trim(),
      link: formData.current.link.trim(),
      assessment: formData.current.assessment
        .filter((date) => date.length > 0 && date.indexOf("Invalid Date") < 0)
        .join(","),
      interview: formData.current.interview
        .filter((date) => date.length > 0 && date.indexOf("Invalid Date") < 0)
        .join(","),
      notes: formData.current.notes.trim(),
    };
    try {
      if (newJob) {
        setFormMessage({ error: false, message: "Adding job application..." });
        await axiosPrivate.post("/jobs", jobApp);
      } else {
        setFormMessage({ error: false, message: "Saving..." });
        await axiosPrivate.put("/jobs", jobApp);
      }
      setEditOpen(false);
      reloadJobs();
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
      } else if (err.response?.status === 401) {
        setFormMessage({
          error: true,
          message: "Your session has expired. Please refresh the page.",
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
    if (formMessage.message.length > 0 || !job?.id) {
      return;
    }
    setFormMessage({ error: false, message: "Deleting job application..." });
    axiosPrivate
      .delete("/jobs", { data: { id: job.id } })
      .then(() => {
        setDeleteOpen(false);
        reloadJobs();
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
        } else if (err.response?.status === 401) {
          setFormMessage({
            error: true,
            message: "Your session has expired. Please refresh the page.",
          });
        } else {
          setFormMessage({
            error: true,
            message: err.response?.data?.message || err.message,
          });
        }
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {(!newJob && `Edit ${job?.company} Application`) || "Add Job"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Company"
              fullWidth
              variant="standard"
              type="text"
              margin="dense"
              defaultValue={formData.current.company}
              onChange={(e) => (formData.current.company = e.target.value)}
              inputProps={{ maxLength: 255 }}
              required
            />
            <TextField
              label="Location"
              fullWidth
              variant="standard"
              type="text"
              margin="dense"
              defaultValue={formData.current.location}
              onChange={(e) => (formData.current.location = e.target.value)}
              inputProps={{ maxLength: 255 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.current.remote}
                  onChange={(e) => {
                    formData.current.remote = e.target.checked;
                    update();
                  }}
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
              defaultValue={formData.current.link}
              onChange={(e) => (formData.current.link = e.target.value)}
              inputProps={{ maxLength: 255 }}
            />
            <DatePicker
              format="YYYY-MM-DD"
              margin="dense"
              label="Application Date"
              defaultValue={
                formData.current.application.length > 0
                  ? dayjs(formData.current.application)
                  : newJob
                  ? dayjs()
                  : null
              }
              onChange={(e) =>
                (formData.current.application = e ? e.format("YYYY-MM-DD") : "")
              }
              sx={{ mt: "15px", mr: "15px" }}
            />
            <br />
            {formData.current.assessment.map((value, index) => (
              <Box key={index}>
                <DatePicker
                  format="YYYY-MM-DD"
                  margin="dense"
                  label={`Technical Assessment ${index + 1}`}
                  defaultValue={value.length > 0 ? dayjs(value) : null}
                  onChange={(e) =>
                    (formData.current.assessment[index] = e
                      ? e.format("YYYY-MM-DD")
                      : "")
                  }
                  sx={{ mt: "15px" }}
                />
                {formData.current.assessment.length > 1 && (
                  <Tooltip title="Remove technical assessment date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.current.assessment.splice(index, 1);
                        update();
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {Number(index) === formData.current.assessment.length - 1 && (
                  <Tooltip title="Add another technical assessment date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.current.assessment.push("");
                        update();
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <br />
              </Box>
            ))}
            {formData.current.interview.map((value, index) => (
              <Box key={index}>
                <DatePicker
                  format="YYYY-MM-DD"
                  margin="dense"
                  label={`Interview ${index + 1}`}
                  defaultValue={value.length > 0 ? dayjs(value) : null}
                  onChange={(e) =>
                    (formData.current.interview[index] = e
                      ? e.format("YYYY-MM-DD")
                      : "")
                  }
                  sx={{ mt: "15px" }}
                />
                {formData.current.interview.length > 1 && (
                  <Tooltip title="Remove interview date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.current.interview.splice(index, 1);
                        update();
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {Number(index) === formData.current.interview.length - 1 && (
                  <Tooltip title="Add another interview date">
                    <IconButton
                      sx={{ mt: "22px" }}
                      onClick={() => {
                        formData.current.interview.push("");
                        update();
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
              label="Decision Date"
              defaultValue={
                formData.current.decision.length > 0
                  ? dayjs(formData.current.decision)
                  : null
              }
              onChange={(e) =>
                (formData.current.decision = e ? e.format("YYYY-MM-DD") : "")
              }
              sx={{ mt: "15px" }}
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.current.offered}
                  onChange={(e) => {
                    formData.current.offered = e.target.checked;
                    update();
                  }}
                />
              }
              label="Job Offered"
            />
            <TextField
              label="Notes"
              variant="standard"
              type="text"
              margin="dense"
              defaultValue={formData.current.notes}
              onChange={(e) => (formData.current.notes = e.target.value)}
              inputProps={{ maxLength: 1000 }}
              fullWidth
              multiline
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">{newJob ? "Add" : "Save"}</Button>
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
        <DialogTitle>Delete {job?.company} Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your application to {job?.company}?
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
});

export default JobDialogs;
