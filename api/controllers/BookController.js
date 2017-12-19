'use strict';

module.exports = function BookController ($) {
  const Book = $('Book');
  const bookService = $('BookService');

  return {
    'GET /:id': async (ctx) => {
      const book = await Book.findById(ctx.params.id);
      ctx.body = book;
    },
    'GET /Author': async (ctx) => {
      const book = await Book.find({ title: 'Harry Potter and the Philosopher\'s Stone' });
      const author = await book[0].findAssociatedAuthor();
      ctx.body = author;
    },
    'GET /HarryPotter': async (ctx) => {
      const harryPotter = await Book.findCompleteReferenceByTitle('Harry Potter and the Philosopher\'s Stone');
      ctx.body = harryPotter;
    },
    'POST /': async (ctx) => {
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
