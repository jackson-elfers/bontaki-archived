module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.create(data);
    var copyOne = JSON.parse(JSON.stringify(data));
    copyOne._id = data.parent_id;
    await this.method.helpers.controllers.resolvedOrSilenced(copyOne);
    const response = await this.method.services.comment.create(data);
    var copyTwo = JSON.parse(JSON.stringify(data));
    await this.method.notifications.comment.create(copyTwo);
    return response;
  }

  async read(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.read(data);
    return await this.method.services.comment.read(data);
  }

  async update(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.update(data);
    return await this.method.services.comment.update(data);
  }

  async remove(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.remove(data);
    return await this.method.services.comment.remove(data);
  }
};
