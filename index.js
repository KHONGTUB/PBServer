const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/usersRoutes");
const recordRouter = require("./routes/userRecordRoutes");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.listen(3000, () => console.log("Started on port 3000"));

app.use("/users", userRouter);
app.use("/userRecord", recordRouter);

app.get("/", (req, res) => {
  res.send("Hey welcome to my server");
});
