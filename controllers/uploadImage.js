
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
              var title = req.body.title;
              var des = req.body.description;
              var isSharable = req.body.isSharable;
              var imageName = req.file.filename;

                if( title != null && des != null && isSharable != null && imageName != null ) {
                    isSharable = (typeof req.body.isSharable ==  "undefined") ? false : true;

                              Image.create({
                                'imageName' : imageName ,
                                'imageTitle' : title ,
                                'imageDescription' : des,
                                'userEmail' : req.user,
                                'isSharable' : isSharable
                                }, function(err, resp){
                                if(err) {
                                  console.log(err);
                                  res.render('home' , { msg : 'File uploaded but failed to store!', email : req.user , images : imagesResp })
                                }
                                else{
                                  console.log('Image uploaded and stored successfully');
                                  fetchImages(req,function(err,imagesResp ){
                                      if(err){
                                        res.render('home' , { msg : 'File uploaded but error in display images' , email : req.user , url : 'https://sheltered-escarpment-64025.herokuapp.com/fetchImage/' + req.file.filename, images : imagesResp  })
                                      }
                                      else{
                                        res.render('home' , { msg : 'File uploaded!' , email : req.user , url : 'https://sheltered-escarpment-64025.herokuapp.com/fetchImage/' + req.file.filename, images : imagesResp  })
                                      }
                                  });
                                }
                              });
                }
                else{
                    console.log('Imvalid parameters received for upload image');
                    res.render('home', {msg : 'Error : Invalid paramters received' , email : req.user , images : imagesResp })
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
