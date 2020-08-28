module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.create(data);
    var copyOne = JSON.parse(JSON.stringify(data));
    copyOne._id = data.parent_id;
    const issue = await this.method.services.issue.readSingleId(copyOne);
    if (issue.results.length === 0) {
      throw new Error("issue doesn't exist");
    }
    var copyTwo = JSON.parse(JSON.stringify(data));
    copyTwo._id = data.owner_id;
    const user = await this.method.services.user.readSingleId(copyTwo);
    if (user.results.length === 0) {
      throw new Error("user doesn't exist");
    }
    data.link = `/issue/read/id/${data.parent_id}`;
    data.body = `${user.results[0].username} says -- ${data.body.slice(0, 400)} -- ${issue.results[0].body.slice(
      0,
      400
    )}`;
    await this.method.helpers.controllers.notifyCommentors(data);
  }
};
