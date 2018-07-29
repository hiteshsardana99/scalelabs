
//default libraries
const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const passport  = require('passport');

//custome libraries
const UploadImageController = require('../controllers/uploadImage');
const UserOperations        = require('../controllers/userOperations');
const ImageController       = require('../controllers/uploadImage');

//add restrictions in api
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://sheltered-escarpment-64025.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var upload = multer();



/* GET Default Page  */
router.get('/', (req,res) => {

    if(req.isAuthenticated()) {
        res.redirect('/home');
    }
    else{
      res.redirect('/login');
    }
});

/* Get Register Page */
router.get('/login', (req,res) => {
    if(req.isAuthenticated()) {
        //need to redirect on home page
        res.redirect('/home');
    }
    else{
      //need to sign in
      console.log('Inside login page');
      req.logout();
      res.render('index');
    }
});


/* GET Register Page */
router.get('/register', (req,res) => {
  if(req.isAuthenticated()) {
      //need to redirect on home page
      res.redirect('/home');
  }
  else{
    //need to sign in
    console.log('Inside register page');
    req.logout();
    res.render('register');
  }
});


/* GET Home Page */
router.get('/home', (req,res) => {
    console.log('inside home page');
    if(req.isAuthenticated()) {
      ImageController.fetchImages(req, function(err,response) {
          if(err){
            console.log(err);
            res.redirect('/login');
          }
          else{
            console.log('display images');
            // console.log(response, req.user.userEmailId);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            var passedMsg = req.query.valid;
            if(passedMsg != null) {
              res.render('home', {email : req.user, images : response, msg : passedMsg });
            }
            else{
              res.render('home', {email : req.user, images : response });
            }

          }
      });
    }
    else{
      console.log("Unauthorized user");
      res.redirect('/login');
    }
});

/* Not Found Page */
router.get('/NotFound', (req,res) => {
      res.render('imageNotFound');
});

/* Logout Page */
router.get('/logout', (req,res) => {
  console.log('inisde logout');
  req.logout();
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.redirect('/login');
});

/* Google login / sign in */
router.get(
    '/auth/google',
    passport.authenticate('google',{
      scope: ['profile', 'email']
    })
  );

  router.get('/auth/google/callback',
      passport.authenticate('google'),
      (req,res) => {
        res.redirect('/home');
      }
    );


//Home page
router.post('/home' ,  UploadImageController.uploadImage );
//fetch signle image
router.get('/fetchImage/:id' , UploadImageController.fetchImage );
//router.get('/fetchAllUserImages', UploadImageController.fetchAllUserImages )

//user route
router.post('/login' ,upload.array(), UserOperations.login);
router.post('/register' ,upload.array(), UserOperations.register);





module.exports = router;
