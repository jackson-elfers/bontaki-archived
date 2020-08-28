module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async readOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.readOwner(data);
    return await this.method.services.category.readOwner(data);
  }
};
