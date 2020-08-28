const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(owner_id) owner_id,
created_at,
updated_at,
category,
score
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.create(data);
    const query = `
insert into category
values(
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp(),
?,
?
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.owner_id, data.category, 0];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), { _id: _id });
  }

  async readOwnerId(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.readOwnerId(data);

    const query = `
select
${columns}
from category
where owner_id = uuid_to_bin(?)
order by score desc limit 10;
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readOwnerCategory(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.readOwnerCategory(data);

    const query = `
select
${columns}
from category
where owner_id = uuid_to_bin(?) and category = ?;
`;
    const params = [data.owner_id, data.category];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async updateScoreUp(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.updateScoreUp(data);

    const query = `
update category set
updated_at = current_timestamp(),
score = score + 1
where owner_id = uuid_to_bin(?) and category = ?;
`;
    const params = [data.owner_id, data.category];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async updateScoreDown(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.category.updateScoreDown(data);

    const query = `
update category set
updated_at = current_timestamp(),
score = score - 1
where owner_id = uuid_to_bin(?) and category = ?;
`;
    const params = [data.owner_id, data.category];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
