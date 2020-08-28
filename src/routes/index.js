const utils = require("../utils");
const user = require("./user");
const issue = require("./issue");
const silence = require("./silence");
const report = require("./report");
const comment = require("./comment");
const category = require("./category");
const notify = require("./notify");
const client = require("./client");
const config = require("../config");

module.exports = function(app) {
  // user
  app.post(config.api.user.login, utils.asyn.route(user.login));
  app.get(config.api.user.logout, user.logout);
  app.get(`${config.api.user.readSingleId}/:_id`, user.readSingleId);
  app.get(`${config.api.user.usernameExists}/:username`, user.usernameExists);
  app.get(config.api.user.info, utils.asyn.route(utils.jwt.secured), utils.asyn.route(user.info));
  app.post(config.api.user.register, utils.recaptcha.verify, utils.asyn.route(user.register));
  app.put(config.api.user.updateUsername, utils.asyn.route(utils.jwt.secured), utils.asyn.route(user.updateUsername));
  app.put(config.api.user.updatePassword, utils.asyn.route(utils.jwt.secured), utils.asyn.route(user.updatePassword));
  app.delete(config.api.user.unregister, utils.asyn.route(utils.jwt.secured), utils.asyn.route(user.unregister));

  // issue
  app.post(config.api.issue.create, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.create));
  app.get(config.api.issue.findIssue, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.findIssue));
  app.get(`${config.api.issue.resolvedDate}/:index/:offset`, utils.asyn.route(issue.resolvedDate));
  app.get(`${config.api.issue.resolvedCategory}/:category/:index/:offset`, utils.asyn.route(issue.resolvedCategory));
  app.get(
    `${config.api.issue.unresolvedOwner}/:index/:offset`,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(issue.unresolvedOwner)
  );
  app.get(
    `${config.api.issue.resolvedOwner}/:index/:offset`,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(issue.resolvedOwner)
  );
  app.get(`${config.api.issue.readSingleUrlTitle}/:url_title`, utils.asyn.route(issue.readSingleUrlTitle));
  app.get(`${config.api.issue.readSingleId}/:_id`, utils.asyn.route(issue.readSingleId));
  app.put(config.api.issue.update, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.update));
  app.put(config.api.issue.resolved, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.resolved));
  app.put(config.api.issue.reported, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.reported));
  app.delete(`${config.api.issue.remove}/:_id`, utils.asyn.route(utils.jwt.secured), utils.asyn.route(issue.remove));

  // silence
  app.post(config.api.silence.create, utils.asyn.route(utils.jwt.secured), utils.asyn.route(silence.create));

  // report
  app.post(config.api.report.create, utils.asyn.route(utils.jwt.secured), utils.asyn.route(report.create));

  // comment
  app.post(config.api.comment.create, utils.asyn.route(utils.jwt.secured), utils.asyn.route(comment.create));
  app.get(`${config.api.comment.read}/:parent_id`, utils.asyn.route(comment.read));
  app.put(config.api.comment.update, utils.asyn.route(utils.jwt.secured), utils.asyn.route(comment.update));
  app.delete(
    `${config.api.comment.remove}/:_id`,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(comment.remove)
  );

  // category
  app.get(config.api.category.readOwner, utils.asyn.route(utils.jwt.secured), utils.asyn.route(category.readOwner));

  // notify
  app.get(
    `${config.api.notify.readNew}/:index/:offset`,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(notify.readNew)
  );
  app.get(
    `${config.api.notify.readOld}/:index/:offset`,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(notify.readOld)
  );
  app.put(
    config.api.notify.updateDismissed,
    utils.asyn.route(utils.jwt.secured),
    utils.asyn.route(notify.updateDismissed)
  );

  // client
  app.get("/", client.home);
  app.get("*", client.home);
};
