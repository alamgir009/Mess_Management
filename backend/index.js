const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const dataBase = require("./config/db");
const userRouter = require("./routes/userRoute.js");
const cookieParser = require("cookie-parser");

env.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(cookieParser());

server.use("/", userRouter);

//Database Connection
dataBase();

server.listen(process.env.PORT, () => {
  console.log(`Server started at port : ${process.env.PORT}`);
});
