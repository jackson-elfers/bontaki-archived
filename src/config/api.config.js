module.exports = {
  user: {
    login: "/api/user/login",
    logout: "/api/user/logout",
    readSingleId: "/api/user/read/id",
    usernameExists: "/api/user/exists/username",
    info: "/api/user/info",
    register: "/api/user/register",
    updateUsername: "/api/user/update/username",
    updatePassword: "/api/user/update/password",
    unregister: "/api/user/unregister"
  },
  issue: {
    create: "/api/issue/create",
    findIssue: "/api/issue/find",
    resolvedDate: "/api/issue/read/resolved/date",
    resolvedCategory: "/api/issue/read/resolved/category",
    unresolvedOwner: "/api/issue/read/unresolved/owner",
    resolvedOwner: "/api/issue/read/resolved/owner",
    readSingleUrlTitle: "/api/issue/read/single",
    readSingleId: "/api/issue/read/single/id",
    update: "/api/issue/update",
    resolved: "/api/issue/update/resolved",
    reported: "/api/issue/report",
    remove: "/api/issue/delete"
  },
  silence: {
    create: "/api/silence/user"
  },
  report: {
    create: "/api/report/issue"
  },
  comment: {
    create: "/api/comment/create",
    read: "/api/comment/read",
    update: "/api/comment/update",
    remove: "/api/comment/delete"
  },
  category: {
    readOwner: "/api/category/read/owner"
  },
  notify: {
    readNew: "/api/notify/read/unread",
    readOld: "/api/notify/read/read",
    updateDismissed: "/api/notify/update/dismissed"
  },
  files: {
    create: "/api/files/create",
    readByParentId: "/api/files/read/parent_id",
    readByStorageName: "/api/files/read/storage",
    remove: "/api/files/remove"
  }
};
