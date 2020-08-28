const actions = require("../controllers");
const utils = require("../utils");
const check = require("check-types");
const config = require("../config");

module.exports.readNew = async function(req, res) {
  try {
    req.params.owner_id = req.user._id;
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    res.json(utils.api.send((await actions.notify.readNew(req.params)).results));
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

module.exports.readOld = async function(req, res) {
  try {
    req.params.owner_id = req.user._id;
    req.params.index = Number(req.params.index);
    req.params.offset = Number(req.params.offset);
    res.json(utils.api.send((await actions.notify.readOld(req.params)).results));
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

module.exports.updateDismissed = async function(req, res) {
  try {
    check.assert(check.object(req.body), "expected object attached to req.body");
    req.body.owner_id = req.user._id;
    const response = await actions.notify.updateDismissed(req.body);
    res.json(utils.api.send(null));
  } catch (e) {
    console.log(e);
    res.json(utils.api.error({ status: 400, detail: config.messages.serverError }));
  }
};
