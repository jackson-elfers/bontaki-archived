const Controllers = require("./controllers.helper");

const errors = require("../errors/helpers");
const services = require("../services");
const check = require("check-types");

const method = { errors: errors, services: services, check: check };

module.exports.controllers = new Controllers({ method: method });
