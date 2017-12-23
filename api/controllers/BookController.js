'use strict';

module.exports = function BookController ($) {
  const Book = $('Book');
  const bookService = $('BookService');

  return {
    async  'GET /Author' (ctx) {
      const book = await Book.find({ title: 'Harry Potter and the Philosopher\'s Stone' });
      const author = await book[0].findAssociatedAuthor();
      ctx.body = author;
    },
    async  'GET /HarryPotter' (ctx) {
      const harryPotter = await Book.findCompleteReferenceByTitle('Harry Potter and the Philosopher\'s Stone');
      ctx.body = harryPotter;
    },
    async 'POST /' (ctx) {
      const author = await bookService.createAuthor();
      await new Book({
        Accredited: {
          authors: [author._id]
        },
        title: 'Harry Potter and the Philosopher\'s Stone'
      }).save();
      ctx.body = 'successful!';
    }
  };
};
