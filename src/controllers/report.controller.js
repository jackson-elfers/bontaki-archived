module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    this.method.errors.report.create(data);
    const responseOne = await this.method.services.report.read(data);
    if (responseOne.results.length !== 0) {
      throw new Error("user has already reported on this user");
    } else if (responseOne.results.length === this.method.config.settings.report.threshold) {
      await this.method.services.user.unregister({ _id: data.parent_id });
      throw new Error("reported user has been removed");
    }
    return await this.method.services.report.create(data);
  }
};
