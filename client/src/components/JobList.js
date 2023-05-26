import React, { useState, useRef, useMemo } from "react";
import {
  Container,
  Button,
  IconButton,
  Tooltip,
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
  TablePagination,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import JobDialogs from "./JobDialogs";
import JobRow from "./JobRow";

function JobList({ jobs, loadingJobs, reloadJobs }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("application");
  const [search, setSearch] = useState("");
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
    if (search.length === 0) {
      setTotalRows(jobs.length);
      return rowsPerPage > 0
        ? jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : jobs;
    } else {
      const searchRows = [];
      jobs.forEach((row) => {
        for (const field in row) {
          if (
            typeof row[field] === "string" &&
            field !== "username" &&
            field !== "link" &&
            (row[field].toLowerCase().indexOf(search) >= 0 ||
              ("remote".indexOf(search) >= 0 && row.remote))
          ) {
            searchRows.push(row);
            break;
          }
        }
      });
      setTotalRows(searchRows.length);
      return rowsPerPage > 0
        ? searchRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : searchRows;
    }
  }, [jobs, page, rowsPerPage, order, orderBy, search]);

  const changeOrder = (column, defaultOrder = "desc") => {
    if (orderBy === column && order === defaultOrder) {
      setOrder(defaultOrder === "desc" ? "asc" : "desc");
    } else {
      setOrder(defaultOrder);
    }
    setOrderBy(column);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: "10px", mb: "10px" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, mb: "10px" }}>
            <TextField
              placeholder="Search…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
                setPage(0);
              }}
              InputProps={{
                endAdornment: (
                  <>
                    {search ? (
                      <Tooltip title="Clear search">
                        <IconButton
                          onClick={() => {
                            setSearch("");
                            setPage(0);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </>
                ),
              }}
            />
          </Box>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, { label: "All", value: -1 }]}
            component="div"
            count={totalRows}
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
            onClick={() => dialogRef.current.openNewForm()}
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
                <JobRow key={index} job={row} reloadJobs={reloadJobs} />
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
      <JobDialogs ref={dialogRef} reloadJobs={reloadJobs} />
    </>
  );
}

export default JobList;
