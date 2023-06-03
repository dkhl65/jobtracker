# Server

This is the server for the jobtracking app. It runs on Express.js, with a PostgreSQL database hosted on CockroachDB.

## Environment variables

`DATABASE_URL`: The full access URL of the PostgreSQL database. \
`ACCESS_TOKEN_SECRET`: Generated using `require("crypto").randomBytes(64).toString("hex")` \
`REFRESH_TOKEN_SECRET`: Generated using `require("crypto").randomBytes(64).toString("hex")`

## Directory Structure

### config

Configuration for allowed origins.

### middleware

Verifies credentials and JWT.

### models

Describes tables in the PostgreSQL database.

### routes

Functions for each route of the REST API.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
The server runs on [http://localhost:4000](http://localhost:4000).

The server will reload when you make changes.\

### `npm start`

Runs the server in production mode.
