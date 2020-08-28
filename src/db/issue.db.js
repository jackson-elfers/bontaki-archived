const columns = `
bin_to_uuid(_id) _id,
bin_to_uuid(owner_id) owner_id,
created_at,
updated_at,
url_title,
body,
categories,
resolved,
public,
reported
`;

module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  // helpers

  async readSingleOwnerId(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readSingleOwnerId(data);
    const query = `
select
${columns}
from issue
where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readUnresolvedCategories(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readUnresolvedCategories(data);
    var like = data.categories.length === 0 ? "" : " and categories like ";
    data.categories.map((d, i) => {
      like += ` ${this.method.sqlstring.escape(`%${d}%`)} `;
    });
    const query = `
select
${columns}
from issue
where owner_id != uuid_to_bin(?) and resolved = 0x00 and public = 0x01 ${like}
order by created_at desc limit 32;
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readUnresolvedAny(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readUnresolvedAny(data);
    const query = `
select
${columns}
from issue
where owner_id != uuid_to_bin(?) and resolved = 0x00 and public = 0x01
order by created_at desc limit 32;
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  // db
  async create(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.create(data);

    const short_title = data.body
      .split(" ")
      .slice(0, 12)
      .join(" ")
      .toLowerCase();
    const url_title = `${this.method.urlify(short_title)}-${this.method.shortid.generate()}`;

    const query = `
insert into issue
values(
uuid_to_bin(?),
uuid_to_bin(?),
current_timestamp(),
current_timestamp(),
?,
?,
?,
?,
?,
?
);
`;
    const _id = this.method.uuid();
    const params = [_id, data.owner_id, url_title, data.body, data.categories, false, data.public, 0];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), {
      _id: _id,
      url_title: url_title
    });
  }

  async resolvedDate(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolvedDate(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);
    const query = `
select
${columns}
from issue
where resolved = 0x01 and public = 0x01
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async resolvedCategory(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolvedCategory(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);
    const query = `
select
${columns}
from issue
where resolved = 0x01 and public = 0x01 and categories like %?%
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [data.category];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async unresolvedOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.unresolvedOwner(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);
    const query = `
select
${columns}
from issue
where owner_id = uuid_to_bin(?) and resolved = 0x00
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async resolvedOwner(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolvedOwner(data);
    const index = this.method.sqlstring.escape(data.index);
    const offset = this.method.sqlstring.escape(data.offset);
    const query = `
select
${columns}
from issue
where owner_id = uuid_to_bin(?) and resolved = 0x01
order by created_at desc limit ${index * offset}, ${offset};
`;
    const params = [data.owner_id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readSingleUrlTitle(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readSingleUrlTitle(data);
    const query = `
select
${columns}
from issue
where url_title = ?;
`;
    const params = [data.url_title];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async readSingleId(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.readSingleId(data);
    const query = `
select
${columns}
from issue
where _id = uuid_to_bin(?);
`;
    const params = [data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async update(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.update(data);

    const short_title = data.body
      .split(" ")
      .slice(0, 12)
      .join(" ")
      .toLowerCase();
    const url_title = `${this.method.urlify(short_title)}-${this.method.shortid.generate()}`;

    const query = `
update issue set
updated_at = current_timestamp(),
url_title = ?,
body = ?,
categories = ?,
public = ?
where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [url_title, data.body, data.categories, data.public, data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params), {
      url_title: url_title
    });
  }

  async resolved(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.resolved(data);

    const query = `
update issue set
updated_at = current_timestamp(),
resolved = ?
where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [true, data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }

  async remove(data) {
    this.method.check.assert(this.method.check.object(data), "expected object as first argument");
    await this.method.errors.issue.remove(data);

    const query = `
delete from issue where owner_id = uuid_to_bin(?) and _id = uuid_to_bin(?);
`;
    const params = [data.owner_id, data._id];
    return await this.method.utils.db.query(this.method.sqlstring.format(query, params));
  }
};
