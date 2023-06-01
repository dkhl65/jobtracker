import React, { useRef } from "react";
import { Box, TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import JobDialogs from "./JobDialogs";

function JobRow({ job, reloadJobs }) {
  const dialogRef = useRef();

  return (
    <>
      <TableRow>
        <TableCell>
          <a
            href={`https://www.google.com/search?q=${job.company}`}
            target="_blank"
            rel="noreferrer"
          >
            {job.company}
          </a>
        </TableCell>
        <TableCell>
          {job.location ? (
            <>
              <a
                href={`https://maps.google.com/?q=${job.location}`}
                target="_blank"
                rel="noreferrer"
              >
                {job.location}
              </a>
              {job.remote && " (Remote)"}
            </>
          ) : job.remote ? (
            "Remote"
          ) : (
            "Unknown"
          )}
        </TableCell>
        <TableCell>{job.application || "Unknown"}</TableCell>
        <TableCell>
          {job.assessment.split(",").map((date, index) => (
            <Box key={index}>{date || "None"}</Box>
          ))}
        </TableCell>
        <TableCell>
          {job.interview.split(",").map((date, index) => (
            <Box key={index}>{date || "None"}</Box>
          ))}
        </TableCell>
        <TableCell>
          {(job.offerred ? "Offerred " : "") + job.rejection ||
            (!job.offerred && "None")}
        </TableCell>
        <TableCell>
          {job.notes.split("\n").map((line, index) => (
            <Box key={index}>{line || <br />}</Box>
          ))}
        </TableCell>
        <TableCell width="120px">
          <Tooltip title="Edit">
            <IconButton onClick={() => dialogRef.current.openEditForm()}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => dialogRef.current.openDeleteForm()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {job.link && (
            <Tooltip title="View job posting">
              <IconButton href={job.link} target="_blank" rel="noreferrer">
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <JobDialogs job={job} ref={dialogRef} reloadJobs={reloadJobs} />
    </>
  );
}

export default JobRow;
