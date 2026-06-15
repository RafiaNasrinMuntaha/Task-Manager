require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
