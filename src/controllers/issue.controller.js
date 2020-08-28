module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  // helpers
  async scoreUserCategories(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.scoreUserCategories(data);
    const issue = await this.method.services.issue.readSingleId(data);
    if (issue.results.length === 0) {
      throw new Error("issue doesn't exist");
    }
    const categories = issue.results[0].categories.split("#");
    for (var i = 0; i < categories.length; ++i) {
      data.category = categories[i];
      var category = await this.method.services.category.readOwnerCategory(data);
      if (category.results.length === 0) {
        await this.method.services.category.create(data);
      }
      if (data.reward) {
        await this.method.services.category.updateScoreUp(data);
      } else {
        await this.method.services.category.updateScoreDown(data);
      }
    }
  }

  async readUserCategories(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readUserCategories(data);
    const response = await this.method.services.category.readOwnerId(data);
    return response.results.map(d => {
      return d.category;
    });
  }

  // controllers

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.create(data);
    return await this.method.services.issue.create(data);
  }

  async findIssue(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.findIssue(data);
    data.categories = await this.readUserCategories(data);
    return await this.method.services.issue.findIssue(data);
  }

  async resolvedDate(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolveDate(data);
    return await this.method.services.issue.resolvedDate(data);
  }

  async resolvedCategory(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolvedCategory(data);
    return await this.method.services.issue.resolvedCategory(data);
  }

  async unresolvedOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.unresolvedOwner(data);
    return await this.method.services.issue.unresolvedOwner(data);
  }

  async resolvedOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolvedOwner(data);
    return await this.method.services.issue.resolvedOwner(data);
  }

  async readSingleUrlTitle(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readSingleUrlTitle(data);
    return await this.method.services.issue.readSingleUrlTitle(data);
  }

  async readSingleId(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readSingleId(data);
    return await this.method.services.issue.readSingleId(data);
  }

  async update(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.update(data);
    this.method.errors.issue.update(data);
    return await this.method.services.issue.update(data);
  }

  async resolved(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolved(data);
    if (data.owner_id === data.user_id) {
      throw new Error("issue owners cannot resolve their own issues");
    }
    await this.method.helpers.controllers.resolvedOrSilenced(data);
    var copyOne = JSON.parse(JSON.stringify(data));
    copyOne.reward = true;
    copyOne.owner_id = data.user_id;
    await this.scoreUserCategories(copyOne);
    var copyTwo = JSON.parse(JSON.stringify(data));
    copyTwo.parent_id = data._id;
    await this.method.notifications.issue.resolved(copyTwo);
    return await this.method.services.issue.resolved(data);
  }

  async remove(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.remove(data);
    return await this.method.services.issue.remove(data);
  }
};
