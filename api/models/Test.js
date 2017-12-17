'use strict';

module.exports = function Test ($) {
  return {
    schema: {
      name: {
        type: String,
        trim: true,
        default: '(Unnamed Test)'
      }
    }  // <- Model details go here
    /* ------ OPTIONAL COMPONENTS ----- */
    // index: {}, // <- custom indexes
    // methods: {}, // <- custom Model instance methods
    // options: {}, // <- mongoose optional configurations
    // statics: {}, // <- custom Model static methods
    // virtuals: {} // <- getters and setters for virtual fields
  };
};
