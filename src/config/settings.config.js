module.exports = {
  user: {
    username: { min: 4, max: 40 },
    password: { min: 4, max: 40 }
  },
  issue: {
    body: { min: 0, max: 10000 },
    categories: { min: 1, max: 6 }
  },
  comment: {
    body: { min: 0, max: 2000 }
  },
  report: {
    threshold: 10
  }
};
