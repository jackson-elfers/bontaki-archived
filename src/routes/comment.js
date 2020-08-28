const actions = require("../controllers");
const utils = require("../utils");
const check = require("check-types");
const config = require("../config");

module.exports.create = async function(req, res) {
  try {
    req.body.owner_id = req.user._id;
    const response = await actions.comment.create(req.body);
    res.json(utils.api.send({ _id: response.info._id }));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: "It appears you've been silenced from the chat..."
      })
    );
  }
};

module.exports.read = async function(req, res) {
  try {
    res.json(utils.api.send((await actions.comment.read(req.params)).results));
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
    await actions.comment.update(req.body);
    res.json(utils.api.send(null));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};

module.exports.remove = async function(req, res) {
  try {
    req.params.owner_id = req.user._id;
    await actions.comment.remove(req.params);
    res.json(utils.api.send(null));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};
