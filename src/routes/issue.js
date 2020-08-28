const actions = require("../controllers");
const utils = require("../utils");
const check = require("check-types");
const config = require("../config");

module.exports.create = async function(req, res) {
  try {
    req.body.owner_id = req.user._id;
    const response = await actions.issue.create(req.body);
    res.json(utils.api.send({ _id: response.info._id, url_title: response.info.url_title }));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.findIssue = async function(req, res) {
  try {
    req.body.owner_id = req.user._id;
    res.json(utils.api.send((await actions.issue.findIssue(req.body)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.resolvedDate = async function(req, res) {
  try {
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    res.json(utils.api.send((await actions.issue.resolvedDate(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.resolvedCategory = async function(req, res) {
  try {
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    res.json(utils.api.send((await actions.issue.resolvedCategory(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.unresolvedOwner = async function(req, res) {
  try {
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    req.params.owner_id = req.user._id;
    res.json(utils.api.send((await actions.issue.unresolvedOwner(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.resolvedOwner = async function(req, res) {
  try {
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    req.params.owner_id = req.user._id;
    res.json(utils.api.send((await actions.issue.resolvedOwner(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.readSingleUrlTitle = async function(req, res) {
  try {
    res.json(utils.api.send((await actions.issue.readSingleUrlTitle(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.readSingleId = async function(req, res) {
  try {
    res.json(utils.api.send((await actions.issue.readSingleId(req.params)).results));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.serverError
      })
    );
  }
};

module.exports.update = async function(req, res) {
  try {
    check.assert(check.object(req.body), "expected object attached to req.body");
    req.body.owner_id = req.user._id;
    const response = await actions.issue.update(req.body);
    res.json(utils.api.send({ url_title: response.info.url_title }));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};

module.exports.resolved = async function(req, res) {
  try {
    check.assert(check.object(req.body), "expected object attached to req.body");
    req.body.owner_id = req.user._id;
    const response = await actions.issue.resolved(req.body);
    res.json(utils.api.send(null));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};

module.exports.reported = async function(req, res) {
  try {
    check.assert(check.object(req.body), "expected object attached to req.body");
    const response = await actions.issue.reported(req.body);
    res.json(utils.api.send(null));
  } catch (e) {
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};

module.exports.remove = async function(req, res) {
  try {
    req.params.owner_id = req.user._id;
    const response = await actions.issue.remove(req.params);
    res.json(utils.api.send(null));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};
