module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async resolvedOrSilenced(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.controllers.resolvedOrSilenced(data);
    const issue = await this.method.services.issue.readSingleId(data);
    if (issue.results.length === 0) {
      throw new Error("issue doesn't exist");
    }
    if (issue.results[0].resolved) {
      throw new Error("issue has been resolved");
    }
    var copy = JSON.parse(JSON.stringify(data));
    copy.parent_id = data._id;
    copy.user_id = data.owner_id;
    const silence = await this.method.services.silence.read(copy);
    if (silence.results.length !== 0) {
      throw new Error("user has been silenced");
    }
  }

  async notifyIssuer(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.controllers.notifyIssuer(data);
    const issue = await this.method.services.issue.readSingleId(data);
    if (issue.results.length === 0) {
      return null;
    }
    if (issue.results[0].owner_id !== data.owner_id) {
      var copy = JSON.parse(JSON.stringify(data));
      copy.owner_id = issue.results[0].owner_id;
      await this.method.services.notify.create(copy);
    }
    return issue.results[0].owner_id;
  }

  async notifyCommentors(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.controllers.notifyCommentors(data);
    var copy = JSON.parse(JSON.stringify(data));
    copy._id = data.parent_id;
    const issuer_id = await this.notifyIssuer(copy);
    const comments = await this.method.services.comment.readDistinctComments(data);
    for (var i = 0; i < comments.results.length; ++i) {
      if (issuer_id === comments.results[i].owner_id) {
        continue;
      }
      data.owner_id = comments.results[i].owner_id;
      await this.method.services.notify.create(data);
    }
  }
};
