'use strict';

module.exports = function Book ($) {
  const Author = $('Author');
  return {
    schema: {
      Accredited: {
        authors: [{
          type: 'FK',
          ref: 'Author'
        }]
      },
      title: {
        type: String,
        trim: true,
        default: '(Unnamed Book)'
      }
    }, // <- Model details go here
    /* ------ OPTIONAL COMPONENTS ----- */
    index: {
      title: 1,
      Accredited: -1
    }, // <- custom indexes
    methods: {
      async findAssociatedAuthor () {
        const author = await Author.findById(this._doc.Accredited.authors[0]);
        return author;
      }
    }, // <- custom Model instance methods
    // options: {}, // <- mongoose optional configurations
    statics: {
      async findCompleteReferenceByTitle (title) {
        const book = await this.findOne({ title });
        const author = await book.findAssociatedAuthor();
        return Object.assign({}, book._doc, { Accredited: { authors: [author._doc] } });
      }
    } // <- custom Model static methods
    // virtuals: {} // <- getters and setters for virtual fields
  };
};
