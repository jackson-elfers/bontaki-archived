const User = require("./user.controller");
const Issue = require("./issue.controller");
const Silence = require("./silence.controller");
const Report = require("./report.controller");
const Comment = require("./comment.controller");
const Category = require("./category.controller");
const Notify = require("./notify.controller");

const errors = require("../errors/controllers");
const services = require("../services");
const check = require("check-types");
const mime = require("mime-types");
const axios = require("axios");
const config = require("../config");
const helpers = require("../helpers");
const notifications = require("../notifications");

const method = {
  errors: errors,
  services: services,
  check: check,
  mime: mime,
  axios: axios,
  config: config,
  helpers: helpers,
  notifications: notifications
};

module.exports.user = new User({ method: method });

module.exports.issue = new Issue({ method: method });

module.exports.silence = new Silence({ method: method });

module.exports.report = new Report({ method: method });

module.exports.comment = new Comment({ method: method });

module.exports.category = new Category({ method: method });

module.exports.notify = new Notify({ method: method });
