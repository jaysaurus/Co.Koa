'use strict';

module.exports = function Author ($) {
  return {
    schema: {
      firstName: String,
      lastName: String
    }, // <- Model details go here
    /* ------ OPTIONAL COMPONENTS ----- */
    // index: {}, // <- custom indexes
    // methods: {} // <- custom Model instance methods
    options: { runSettersOnQuery: true }, // <- mongoose optional configurations
    // statics: {}, // <- custom Model static methods
    virtuals: {
      name: {
        get () { return `${this.lastName}, ${this.firstName}`; },
        set (name) {
          const fullName = name.split(' ');
          this.firstName = fullName[0];
          this.lastName = fullName[1];
          return this;
        }
      }
    } // <- getters and setters for virtual fields
  };
};
