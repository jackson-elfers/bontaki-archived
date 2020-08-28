module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  // helpers
  async issueOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.silence.issueOwner(data);
    const response = await this.method.services.issue.readSingleOwnerId(data);
    if (response.results.length === 0) {
      return false;
    }
    return true;
  }

  // controllers
  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.silence.create(data);
    var copyOne = JSON.parse(JSON.stringify(data));
    copyOne._id = data.parent_id;
    if (!(await this.issueOwner(copyOne))) {
      throw new Error("only issue owners can silence users");
    }
    if ((await this.method.services.silence.read(data)).results.length !== 0) {
      throw new Error("silence already exists for this user on this issue");
    }
    var copyTwo = JSON.parse(JSON.stringify(data));
    copyTwo.owner_id = data.user_id;
    await this.method.services.comment.removeUserComments(copyTwo);
    return await this.method.services.silence.create(data);
  }
};
