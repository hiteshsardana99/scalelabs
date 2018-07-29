
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({

  userEmailId : {
    type : String,
    required : true
  },
  userPassword : {
    type : String,
  },
  signInStatus : {
    type : Number,
  },
  userName : String
});


module.exports = mongoose.model("User" , UserSchema, 'UserCollection');
