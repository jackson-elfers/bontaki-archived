require("dotenv").config();
const express = require("express");
const utils = require("./src/utils");
const db = require("./src/db");
const app = express();
const server = require("http").Server(app);
const sockets = require("./src/sockets");

async function main() {
  // connect database
  utils.db.connect();
  // test database connection
  await utils.db.ready();
  // seed database models
  await db.models.user();
  await db.models.issue();
  await db.models.silence();
  await db.models.report();
  await db.models.comment();
  await db.models.category();
  await db.models.notify();
  console.log("database: connected");
  // connect sockets
  sockets(server);
  console.log("sockets: connected");
  // start server
  server.listen(process.env.PORT, function() {
    require("./src")(app);
    console.log("server: connected");
    console.log("port: " + process.env.PORT);
  });
}

main().catch(error => {
  console.log(error);
});
