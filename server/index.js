const express = require("express");
const cors = require("cors");

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://jobtracking.vercel.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Okay");
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
