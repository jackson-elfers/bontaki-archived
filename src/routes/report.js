const actions = require("../controllers");
const utils = require("../utils");
const check = require("check-types");
const config = require("../config");

module.exports.create = async function(req, res) {
  try {
    req.body.owner_id = req.user._id;
    const response = await actions.report.create(req.body);
    res.json(utils.api.send({ _id: response.info._id }));
  } catch (e) {
    console.log(e);
    res.json(
      utils.api.error({
        status: 400,
        detail: config.messages.report.create
      })
    );
  }
};
