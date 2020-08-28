const actions = require("../controllers");
const utils = require("../utils");
const config = require("../config");
const check = require("check-types");

module.exports.readOwner = async function(req, res) {
  try {
    res.json(utils.api.send((await actions.category.readOwner({ _id: req.user._id })).results));
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
