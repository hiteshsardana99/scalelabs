
const mongoose = require('mongoose');
const path = require('path');
//custome libraries
const UploadImageHelper = require('../helper/uploadImageHelper');
const Image = require('../models/ImageModel');
// const Image = mongoose.model('Image');

exports.uploadImage = function(req,res) {
    //check whether user is authenticated of not
    if(req.isAuthenticated()) {
      UploadImageHelper.uploadImage(req,res, (err) => {
        if(err){
          console.log('err',err);
          res.render('home', {msg :  err});
        }
        else{

          if(req.file == undefined) {
            res.render('home' , { msg : 'Error : No File Selected!'})
          }
          else {
            var isSharable = (typeof req.body.isSharable ==  "undefined") ? false : true;

            Image.create({
              'imageName' : req.file.filename ,
              'imageTitle' : req.body.title ,
              'imageDescription' : req.body.description,
              'userEmail' : req.user,
              'isSharable' : isSharable
              }, function(err, resp){
              if(err) {
                console.log(err);
                res.render('home' , { msg : 'File uploaded but failed to store!' })
              }
              else{
                console.log('Image uploaded and stored successfully');
                res.render('home' , { msg : 'File uploaded!' , email : req.user , url : 'http://localhost:3000/fetchImage/' + req.file.filename })
              }
            });
          }
        }
      });
    }
    else{
        //user is not log in
        console.log('User is not login');
        res.redirect('/login');
    }
}


exports.fetchImage = function(req,res) {
  var fileName = req.params.id;
  if(req.isAuthenticated()  ) {
      Image.findOne({'imageName' : fileName}).then( image => {
        if(image) {
          //Image found
          if(image.isSharable || ( !image.isSharable && image.userEmail == req.user )) {
            //Image is sharable with community
            res.sendFile(path.join(__dirname, "../public/uploads/" + fileName));
          }
          else{
            console.log('Image not allow to share');
            res.status(200).json({'status' : 101});
          }
        }
        else{
          //image not found
          console.log('Image not found');
          res.status(404).json({'status' : 101});
        }
      });
  }
  else {
      console.log('Unauthorized user -> redirecting back to login page');
      res.status(401).json({'status' : 101});
  }
}


exports.fetchImages  = function(req,callback) {

  if(req.isAuthenticated()) {
    //authenticated user
    Image.find({
      $or : [
        {'userEmail' : req.user},
        {'isSharable' : true}
      ]
      }, {'_id' : 0 }, function(err,response) {
      if(err){
        console.log(err);
        // res.status(400).json({'status' : 101});
        callback(err,undefined);
      }
      else{
        console.log('fetch all images');
        // res.status(200).json(response);
        callback(undefined,response);
      }
    });
  }
  else{
    console.log('Unauthorized user');
    // res.status(401).json({'status' : 101});
    callback('Unauthorized user',undefined);
  }
}
