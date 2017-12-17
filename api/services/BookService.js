'use strict';

module.exports = function BookService ($) {
  const Author = $('Author');

  return {
    async createAuthor () {
      const author = await new Author({
        name: 'J.K Rowling' }).save();
      return author;
    }
  };
};
