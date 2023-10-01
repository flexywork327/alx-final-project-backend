const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/jobs", require("./routes/jobs_Routes"));

app.use("/api/v1/users", require("./routes/user_Routes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
