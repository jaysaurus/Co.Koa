/*
* A library of built-in async tools
*/
module.exports = function AsyncHandler () {
  var self = this;

  this.each = async (items, fn) => {
    if (items && items.length) {
      await Promise.all(
        items.map(async (item) => {
          await fn(item);
        }));
    }
  };

  this.reduce = async (items, fn, initialValue) => {
    await self.each(
      items, async (item) => {
        initialValue = await fn(initialValue, item);
      });
    return initialValue;
  };
};
