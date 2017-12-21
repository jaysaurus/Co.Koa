module.exports = {
  eq: (foo, bar) => foo === bar,
  ne: (foo, bar) => foo !== bar,
  lt: (foo, bar) => foo < bar,
  gt: (foo, bar) => foo > bar,
  lte: (foo, bar) => foo <= bar,
  gte: (foo, bar) => foo >= bar,
  and: (foo, bar) => foo && bar,
  or: (foo, bar) => foo || bar
};
