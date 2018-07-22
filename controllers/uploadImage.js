
const mongoose = require('mongoose');
//custome libraries
const UploadImageHelper = require('../helper/uploadImageHelper');
const Image = require('../models/ImageModel');
// const Image = mongoose.model('Image');

exports.uploadImage = function(req,res) {

  UploadImageHelper.uploadImage(req,res, (err) => {
    if(err){
      console.log('err',err);
      res.render('home', {msg :  err});
    }
    else{
      // console.log('e',req.file);
      // res.send('test');
      if(req.file == undefined) {
        res.render('home' , { msg : 'Error : No File Selected!'})
      }
      else {

        Image.create({'imageName' : req.file.filename , 'imageTitle' : 'hitMe' , 'imageDescription' : 'des' }, function(err, resp){
          if(err) {
            console.log(err);
            res.render('home' , { msg : 'File uploaded but failed to store!' , file : 'uploads/$(req.file.filename)'})
          }
          else{
            console.log('Image uploaded and stored successfully');
            res.render('home' , { msg : 'File uploaded!' , file : 'uploads/$(req.file.filename)'})
          }
        });
      }
    }
  });
}
