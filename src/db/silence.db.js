const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(parent_id) parent_id,
created_at,
updated_at,
bin_to_uuid(user_id) user_id
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.silence.create(data);
    const query = `
insert into silence
values(
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp(),
uuid_to_bin(?)
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.parent_id, data.user_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), { _id: _id });
  }

  async read(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.silence.read(data);

    const query = `
select
${columns}
from silence
where parent_id = uuid_to_bin(?) and user_id = uuid_to_bin(?);
`;
    const params = [data.parent_id, data.user_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
