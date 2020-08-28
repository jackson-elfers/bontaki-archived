const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(owner_id) owner_id,
created_at,
link,
body,
dismissed
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.create(data);
    const query = `
insert into notify
values(
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp(),
?,
?,
?
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.owner_id, data.link, data.body, false];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), { _id: _id });
  }

  async readNew(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.readNew(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);

    const query = `
select 
${columns}
from notify
where owner_id = uuid_to_bin(?) and dismissed = 0x00
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readOld(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.readOld(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);

    const query = `
select 
${columns}
from notify
where owner_id = uuid_to_bin(?) and dismissed = 0x01
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async updateDismissed(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.notify.updateDismissed(data);

    const query = `
update notify set
updated_at = current_timestamp(),
dismissed = 0x01
where owner_id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
