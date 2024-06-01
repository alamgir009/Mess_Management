const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const dataBase = require("./config/db");

env.config();
const server = express();

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  console.log("Hello Almagir");
  res.send("<h1>Hello Alamgir </h1>");
});

// <<< Database Connection >>>
dataBase();

server.listen(process.env.PORT, () => {
  console.log(`Server started at port : ${process.env.PORT}`);
});
