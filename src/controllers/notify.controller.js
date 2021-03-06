module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async readNew(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.readNew(data);
    return await this.method.services.notify.readNew(data);
  }

  async readOld(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.readOld(data);
    return await this.method.services.notify.readOld(data);
  }

  async updateDismissed(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.updateDismissed(data);
    return await this.method.services.notify.updateDismissed(data);
  }
};
