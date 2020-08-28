const ReadIssue = require("./read-issue");

const socketio = require("socket.io");
const redis = require("socket.io-redis");
const check = require("check-types");
const config = require("../config");
const utils = require("../utils");

module.exports = function(server) {
  const io = socketio(server);

  if (process.env.REDIS === "true") {
    io.adapter(redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));
  }

  io.on("connection", socket => {
    const method = { socket: socket, config: config, check: check, io: io, utils: utils };
    const readIssue = new ReadIssue({ method: method });

    socket.on(`${config.routes.ReadIssue}/message`, async data => {
      try {
        await readIssue.message(data);
      } catch (e) {
        io.emit(
          `${this.method.config.routes.ReadIssue}/message/${data.url_title}`,
          utils.api.error({ status: 500, detail: config.messages.serverError })
        );
      }
    });

    socket.on(`${config.routes.ReadIssue}/typing`, async data => {
      try {
        await readIssue.typing(data);
      } catch (e) {
        io.emit(
          `${this.method.config.routes.ReadIssue}/typing/${data.url_title}`,
          utils.api.error({ status: 500, detail: config.messages.serverError })
        );
      }
    });
  });
};
