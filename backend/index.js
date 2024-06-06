const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const dataBase = require("./config/db");
const userRouter = require("./routes/userRoute.js");
const marketRouter = require("./routes/marketRoute.js");
const mealRouter = require("./routes/mealRoute.js");
const cookieParser = require("cookie-parser");

env.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(cookieParser());

server.use("/user", userRouter);
server.use("/market", marketRouter);
server.use("/meal", mealRouter);

//Database Connection
dataBase();

server.listen(process.env.PORT, () => {
  console.log(`Server started at port : ${process.env.PORT}`);
});
