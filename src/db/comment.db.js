const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(parent_id) parent_id,
bin_to_uuid(owner_id) owner_id,
created_at,
updated_at,
body
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  // helpers

  async removeUserComments(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.removeUserComments(data);
    const query = `
delete from comment where owner_id = uuid_to_bin(?) and parent_id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data.parent_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readDistinctComments(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.readDistinctComments(data);
    const query = `
select
distinct bin_to_uuid(owner_id) owner_id
from comment
where parent_id = uuid_to_bin(?);
`;
    const params = [data.parent_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  // db
  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.create(data);
    const query = `
insert into comment
values(
uuid_to_bin(?),
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp(),
?
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.parent_id, data.owner_id, data.body];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), { _id: _id });
  }

  async read(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.read(data);

    const query = `
select
${columns}
from comment
where parent_id = uuid_to_bin(?)
order by created_at desc;
`;
    const params = [data.parent_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async update(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.update(data);

    const query = `
update comment set
updated_at = current_timestamp(),
body = ?
where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [data.body, data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async remove(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.comment.remove(data);
    const query = `
delete from comment where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
