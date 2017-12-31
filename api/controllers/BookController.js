'use strict';

module.exports = function BookController ($) {
  const Book = $('Book');
  const bookService = $('BookService');

  return {
    async 'GET /Author' (ctx) {
      const book = await Book.find({ title: 'Harry Potter and the Philosopher\'s Stone' });
      const author = await book[0].findAssociatedAuthor();
      ctx.body = author;
    },
    async 'GET /HarryPotter' (ctx) {
      const harryPotter = await Book.findCompleteReferenceByTitle('Harry Potter and the Philosopher\'s Stone');
      ctx.body = harryPotter;
    },
    async 'GET /HBSDemo' (ctx) {
      await ctx.render('SampleView', { action: '/HBSDemo', imgURL: $(':img').loadURL('co.koa.banner', 'svg') });
    },
    async 'GET /static' (ctx) {
      ctx.type = 'html';
      ctx.body = $(':html').stream('test');
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
    },
    async 'GET /:id' (ctx, next) {
      if (ctx.params.id === 'something') {
        ctx.body = `you're id was 'something'`;
      } else next();
    }
  };
};
