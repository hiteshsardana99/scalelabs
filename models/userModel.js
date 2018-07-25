
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

  userEmailId : {
    type : String,
    required : true
  },
  userPassword : {
    type : String,
    required : true
  },
  uploadedImages : [{
    type : mongoose.Schema.Types.ObjectId
  }]
});


module.exports = mongoose.model("User" , UserSchema, 'UserCollection');
