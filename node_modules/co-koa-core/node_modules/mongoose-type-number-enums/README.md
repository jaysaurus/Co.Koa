[![Build Status](https://travis-ci.org/jaysaurus/mongoose-type-number-enums.svg?branch=master)](https://travis-ci.org/jaysaurus/mongoose-type-number-enums)

# mongoose-type-number-enums
Adds support for mongoose to use enums that persist to mongoDB as numbers rather than strings.

## Installation
You can install mongoose-type-number-enums via npm.
Add mongoose-type-number-enums to the package.json of your app or install it via the command-line: `npm i --save mongoose-type-number-enums`

## Setup
after connecting to your mongoose environment, instantiate the MongooseTypeNumberEnums class and call `.upgradeMongoose(mongoose)` as below:
```javascript
const MongooseTypeNumberEnums = require('mongoose-type-number-enums');
const mongoose = require('mongoose');
...
mongoose.connect( ... ); // <== your config setup goes here
new MongooseTypeNumberEnums().upgradeMongoose(mongoose);
```
Your schemas will now support a numeric enums type.

## Implementation
Just as with mongoose's string-based enums, your schemas will use the enum property to define the values that may be persisted:
```javascript
  var VoxMachinaMember = new mongoose.Schema({
    memberName: {
      type: 'Enum',
      enum: ['VEX', 'GROG', 'PIKE']
    }
  });
  ... // implementation of the model schema above
```
The Enum type expects 'number' and will reject non-numeric values so be sure to supply a number when creating, reading or updating your model.

Below is a contrived example. It is advised that you store your enum arrays somewhere where they can be used by both your schemas and the classes that interact with your schemas.
```javascript
this.createFoo = async () => {
  try {
    let enumArr = ['VEX', 'GROG', 'PIKE'];
    await new VoxMachinaMember({ memberName: enumArr.indexOf('VEX') }).save();
    await new VoxMachinaMember({ memberName: enumArr.indexOf('GROG') }).save();
    await new VoxMachinaMember({ memberName: enumArr.indexOf('PIKE') }).save();
  } catch (e) {
    console.log(`failed: ${e.message}`);
  }
};
```
Given the above instance, your mongo database would store: 0, 1 and 2 respectively in each document's 'memberName' field.

#### Default Configuration
when instantiating MongooseTypeNumberEnums, it can be supplied a two letter i18n code.  The hope, in the long run, is that this build will support other languages than English when generating messages.  Presently, the module only supports English.  PLEASE FORK AND ADD INTERNATIONAL MESSAGES!
