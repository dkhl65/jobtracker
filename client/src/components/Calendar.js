import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ActivityCalendar from "react-activity-calendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Calendar({ jobs, loadingJobs }) {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(dayjs());
  const [field, setField] = useState("application");

  useEffect(() => {
    const dateCount = {};
    dateCount[`${year.$y}-01-01`] = {
      date: `${year.$y}-01-01`,
      count: 0,
      level: 0,
    };
    jobs.forEach((job) => {
      if (field === "rejection" && job.offered) {
        return;
      }
      const dates =
        job[
          field === "offer" || field === "rejection" ? "decision" : field
        ].split(",");
      dates.forEach((entry) => {
        if (dayjs(entry).$y === year.$y && (field !== "offer" || job.offered)) {
          if (!dateCount[entry]) {
            dateCount[entry] = { date: entry, count: 1, level: 1 };
          } else {
            dateCount[entry].count++;
            if (field === "application") {
              dateCount[entry].level = Math.floor(
                (dateCount[entry].count + 1) / 2
              );
            } else {
              dateCount[entry].level = dateCount[entry].count;
            }
          }
        }
      });
    });
    if (!dateCount[`${year.$y}-12-31`]) {
      dateCount[`${year.$y}-12-31`] = {
        date: `${year.$y}-12-31`,
        count: 0,
        level: 0,
      };
    }
    setData(Object.values(dateCount));
  }, [jobs, year, field]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ marginTop: "15px" }}>
        <DatePicker
          views={["year"]}
          value={year}
          label="Year"
          onChange={(e) => setYear(e)}
          sx={{ mb: "15px", mr: "15px" }}
        />
        <FormControl>
          <InputLabel>Activity</InputLabel>
          <Select
            label="Activity"
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <MenuItem value="application">Applications</MenuItem>
            <MenuItem value="assessment">Technical Assessments</MenuItem>
            <MenuItem value="interview">Interviews</MenuItem>
            <MenuItem value="rejection">Rejections</MenuItem>
            <MenuItem value="offer">Offers</MenuItem>
          </Select>
        </FormControl>
        <ActivityCalendar
          data={data}
          loading={loadingJobs}
          blockSize={15}
          labels={{ totalCount: `{{count}} ${field}s in {{year}}` }}
          renderBlock={(block, activity) => (
            <Tooltip
              title={`${activity.count} ${field}${
                activity.count !== 1 ? "s" : ""
              } on ${activity.date}`}
            >
              {block}
            </Tooltip>
          )}
          showWeekdayLabels
        />
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
    </LocalizationProvider>
  );
}

export default Calendar;
