
const mongoose = require('mongoose');
const path = require('path');
//custome libraries
const UploadImageHelper = require('../helper/uploadImageHelper');
const Image = require('../models/ImageModel');


exports.uploadImage = function(req,res) {
    //check whether user is authenticated of not
    if(req.isAuthenticated()) {
      UploadImageHelper.uploadImage(req,res, async (err) => {
        if(err){
          console.log('err',err);
          var string = encodeURIComponent(err);
          res.redirect('/home/?valid='+string)
        }
        else{
          console.log('body',req.body);
          //fetch images for display
          var imagesResp = await displayImages(req);

          if(req.file == undefined) {
            console.log('No file Selected');
            var string = encodeURIComponent('No file selected');
            res.redirect('/home/?valid='+string)
          }
          else {
              var title = req.body.title;
              var des = req.body.description;
              var isSharable = req.body.isSharable;
              var imageName = req.file.filename;

                if( title != null && des != null && imageName != null ) {
                    isSharable = (typeof req.body.isSharable ==  "undefined") ? false : true;

                              Image.create({
                                'imageName' : imageName ,
                                'imageTitle' : title ,
                                'imageDescription' : des,
                                'userEmail' : req.user,
                                'isSharable' : isSharable
                              }, async function(err, resp){
                                if(err) {
                                  console.log(err);
                                  var string = encodeURIComponent('File uploaded but failed to store');
                                  res.redirect('/home/?valid='+string)
                                }
                                else{
                                  console.log('Image uploaded and stored successfully');
                                  res.redirect('/home')
                                }
                              });
                }
                else{
                    console.log('Imvalid parameters received for upload image');
                    var string = encodeURIComponent('Error : Invalid paramters received');
                    res.redirect('/home/?valid='+string)
                }
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

      Image.findOne({'imageName' : fileName}).then( image => {
        if(image) {
          //Image found
            console.log('successfully fetch Image : ' , fileName);
            res.sendFile(path.join(__dirname, "../public/uploads/" + fileName));
        }
        else{
          //image not found
          console.log('Image not found');
          res.redirect('/NotFound')
        }
      });

}


var fetchImages = exports.fetchImages  = function(req,callback) {

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


function displayImages(req) {
  return new Promise(function(resolve,reject){
    Image.find({
      $or : [
        {'userEmail' : req.user},
        {'isSharable' : true}
      ]
      }, {'_id' : 0 }, function(err,response) {
      if(err){
        console.log(err);
        reject(err);
      }
      else{
        console.log('fetch all images');
        resolve(response);
      }
    });
  });
}
