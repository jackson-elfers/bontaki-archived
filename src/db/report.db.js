const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(parent_id) parent_id,
bin_to_uuid(owner_id) owner_id,
created_at,
updated_at
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.report.create(data);
    const query = `
insert into report
values(
uuid_to_bin(?),
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp()
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.parent_id, data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), { _id: _id });
  }

  async read(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.report.read(data);
    const query = `
select
${columns}
from report
where owner_id = uuid_to_bin(?) and parent_id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data.parent_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
