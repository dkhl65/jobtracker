import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Statistics({ jobs, loadingJobs }) {
  const [data, setData] = useState({});
  const [dateRange, setDateRange] = useState("lifetime");
  const [lowerLimit, setLowerLimit] = useState(dayjs().subtract(1, "year"));
  const [upperLimit, setUpperLimit] = useState(dayjs());

  useEffect(() => {
    const dateCheck = (date) => {
      if (date.length === 0) {
        return false;
      }
      if (dateRange === "lifetime") {
        return true;
      }
      if (
        dateRange === "year" &&
        date >= dayjs().subtract(1, "year").format("YYYY-MM-DD")
      ) {
        return true;
      }
      if (
        dateRange === "6months" &&
        date >= dayjs().subtract(6, "month").format("YYYY-MM-DD")
      ) {
        return true;
      }
      if (
        dateRange === "1month" &&
        date >= dayjs().subtract(1, "month").format("YYYY-MM-DD")
      ) {
        return true;
      }
      if (
        dateRange === "custom" &&
        date >= lowerLimit.format("YYYY-MM-DD") &&
        date <= upperLimit.format("YYYY-MM-DD")
      ) {
        return true;
      }
      return false;
    };
    let totalApplications = 0;
    let totalAssessments = 0;
    let totalAssessmentCompanies = 0;
    let totalInterviews = 0;
    let totalInterviewCompanies = 0;
    let totalRejections = 0;
    let totalGhosts = 0;
    let firstApplication = dayjs().format("YYYY-MM-DD");

    jobs.forEach((job) => {
      let mostRecentInteraction = "";
      if (dateCheck(job.application)) {
        totalApplications++;
        if (job.application > mostRecentInteraction) {
          mostRecentInteraction = job.application;
        }
        if (job.application < firstApplication) {
          firstApplication = job.application;
        }
      }

      let oneOrMore = false;
      job.assessment.split(",").forEach((date) => {
        if (dateCheck(date)) {
          oneOrMore = true;
          totalAssessments++;
          if (date > mostRecentInteraction) {
            mostRecentInteraction = date;
          }
        }
      });
      if (oneOrMore) {
        totalAssessmentCompanies++;
        oneOrMore = false;
      }

      job.interview.split(",").forEach((date) => {
        if (dateCheck(date)) {
          oneOrMore = true;
          totalInterviews++;
          if (date > mostRecentInteraction) {
            mostRecentInteraction = date;
          }
        }
      });
      if (oneOrMore) {
        totalInterviewCompanies++;
        oneOrMore = false;
      }

      if (dateCheck(job.rejection)) {
        totalRejections++;
        if (job.rejection > mostRecentInteraction) {
          mostRecentInteraction = job.rejection;
        }
      }

      if (!job.rejection && dayjs().diff(mostRecentInteraction, "day") > 14) {
        totalGhosts++;
      }
    });

    let daysElapsed = 1;
    switch (dateRange) {
      case "year":
        daysElapsed = dayjs().diff(dayjs().subtract(1, "year"), "day");
        break;
      case "6months":
        daysElapsed = dayjs().diff(dayjs().subtract(6, "month"), "day");
        break;
      case "1month":
        daysElapsed = dayjs().diff(dayjs().subtract(1, "month"), "day");
        break;
      case "custom":
        daysElapsed = upperLimit.diff(lowerLimit, "day");
        break;
      default:
        daysElapsed = dayjs().diff(firstApplication, "day");
    }

    setData({
      totalApplications,
      totalAssessments,
      totalAssessmentCompanies,
      totalInterviews,
      totalInterviewCompanies,
      totalRejections,
      totalGhosts,
      daysElapsed,
    });
  }, [dateRange, jobs, lowerLimit, upperLimit]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ marginTop: "15px" }}>
        <FormControl sx={{ mb: "15px" }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <MenuItem value="lifetime">Lifetime</MenuItem>
            <MenuItem value="year">Past year</MenuItem>
            <MenuItem value="6months">Past 6 months</MenuItem>
            <MenuItem value="1month">Past month</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        {dateRange === "custom" && (
          <>
            <DatePicker
              value={lowerLimit}
              label="From"
              onChange={(e) => setLowerLimit(e)}
              sx={{ mb: "15px", ml: "15px" }}
            />
            <DatePicker
              value={upperLimit}
              label="To"
              onChange={(e) => setUpperLimit(e)}
              sx={{ mb: "15px", ml: "15px" }}
            />
          </>
        )}
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "ghostwhite" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Percent of Applications</TableCell>
                <TableCell>Per Week</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Applications</TableCell>
                <TableCell>{data.totalApplications}</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  {(
                    data.totalApplications / Math.max(data.daysElapsed / 7, 1)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Assessments</TableCell>
                <TableCell>
                  {data.totalAssessments} with {data.totalAssessmentCompanies}{" "}
                  companies
                </TableCell>
                <TableCell>
                  {(
                    (data.totalAssessmentCompanies / data.totalApplications) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell>
                  {(
                    data.totalAssessments / Math.max(data.daysElapsed / 7, 1)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Interviews</TableCell>
                <TableCell>
                  {data.totalInterviews} with {data.totalInterviewCompanies}{" "}
                  companies
                </TableCell>
                <TableCell>
                  {(
                    (data.totalInterviewCompanies / data.totalApplications) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell>
                  {(
                    data.totalInterviews / Math.max(data.daysElapsed / 7, 1)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rejections</TableCell>
                <TableCell>{data.totalRejections}</TableCell>
                <TableCell>
                  {(
                    (data.totalRejections / data.totalApplications) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell>
                  {(
                    data.totalRejections / Math.max(data.daysElapsed / 7, 1)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>No Response After 14 Days</TableCell>
                <TableCell>{data.totalGhosts}</TableCell>
                <TableCell>
                  {((data.totalGhosts / data.totalApplications) * 100).toFixed(
                    2
                  )}
                  %
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
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
    </LocalizationProvider>
  );
}

export default Statistics;
