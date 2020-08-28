const Issue = require("./issue.notification");
const Comment = require("./comment.notification");

const errors = require("../errors/notifications");
const services = require("../services");
const check = require("check-types");
const helpers = require("../helpers");

const method = { errors: errors, services: services, check: check, helpers: helpers };

module.exports.issue = new Issue({ method: method });

module.exports.comment = new Comment({ method: method });
