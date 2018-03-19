module.exports = (item, language) => {
  return item.replace(
    /([a-z\d._-]+$)/gi,
    (match, fileName) => { return `${language}.${fileName}`; });
};
