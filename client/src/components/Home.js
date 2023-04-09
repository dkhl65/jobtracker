import React, { useState } from "react";
import {
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  Box,
} from "@mui/material";

function Home() {
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <Container maxWidth="sm">
      <Typography componnt="h1" variant="h1" align="center">
        Job Tracking
      </Typography>
      <Typography>
        Record applied jobs, interviews and rejections. View analytics on them,
        such as interview rate and applications per day. Good luck!
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {hasAccount ? "Sign in" : "Sign up"}
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          {!hasAccount && (
            <TextField
              margin="normal"
              required={!hasAccount}
              fullWidth
              id="confirm-username"
              label="Confirm Username"
              name="confirm-username"
              autoComplete="off"
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {!hasAccount && (
            <TextField
              margin="normal"
              required={!hasAccount}
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="confirm-password"
              id="confirm-password"
              autoComplete="off"
            />
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => setHasAccount(!hasAccount)}
              >
                {hasAccount ? "Need an account?" : "Have an account?"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
