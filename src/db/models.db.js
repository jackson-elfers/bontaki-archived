module.exports = class {
  constructor(props) {
    this.method = props.method;
  }

  async user() {
    const query = `
create table if not exists user(
_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
login_at datetime not null,
username varchar(255) not null unique,
password varchar(255) not null,
primary key (_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async issue() {
    const query = `
create table if not exists issue(
_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
url_title varchar(255) not null,
body text not null,
categories varchar(255) not null,
resolved bit not null,
public bit not null,
reported int not null,
primary key (_id),
foreign key (owner_id)
references user (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async silence() {
    const query = `
create table if not exists silence(
_id binary(16) not null,
parent_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
user_id binary(16) not null,
primary key (_id),
foreign key (parent_id)
references issue (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async report() {
    const query = `
create table if not exists report(
_id binary(16) not null,
parent_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
primary key (_id),
foreign key (parent_id)
references user (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async comment() {
    const query = `
create table if not exists comment(
_id binary(16) not null,
parent_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
body text not null,
primary key (_id),
foreign key (parent_id)
references issue (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async category() {
    const query = `
create table if not exists category(
_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
category varchar(255) not null,
score int not null,
primary key (_id),
foreign key (owner_id)
references user (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async notify() {
    const query = `
create table if not exists notify(
_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
link text not null,
body text not null,
dismissed bit not null,
primary key (_id),
foreign key (owner_id)
references user (_id)
on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }

  async files() {
    const query = `
create table if not exists files(
_id binary(16) not null,
parent_id binary(16) not null,
owner_id binary(16) not null,
created_at datetime not null,
updated_at datetime not null,
content_type varchar(255) not null,
file_name varchar(255) not null,
storage_name varchar(255) not null,
primary key (_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
`;
    await this.method.utils.db.query(query);
  }
};
