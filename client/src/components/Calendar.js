import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "./NavBar";

function Calendar() {
  return (
    <>
      <NavBar />
      <Container sx={{ marginTop: "10px" }}>
        <Typography>Calendar</Typography>
      </Container>
    </>
  );
}

export default Calendar;
