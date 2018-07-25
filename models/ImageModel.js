
const mongoose = require('mongoose');
const { Schema }  = mongoose;

const ImageSchema = new Schema({

  imageName : {
    type : String,
    required : true
  },
  imageTitle : {
    type : String,
    required : true
  },
  imageDescription : {
    type : String,
    required : true
  },
  isSharable : {
    type : Boolean,
    default : false
  },
  userEmail : {
    type : String,
    required : true
  }

});


module.exports = mongoose.model("Image", ImageSchema, "ImageCollection");
