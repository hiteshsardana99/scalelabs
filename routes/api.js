
//default libraries
const express = require('express');
const router = express.Router();
const multer = require('multer');
//custome libraries
const UploadImageController = require('../controllers/uploadImage');
const UserOperations = require('../controllers/userOperations');


//add restrictions in api
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var upload = multer();


//Image route
router.post('/uploadImage' ,  UploadImageController.uploadImage );
//fetch signle image
router.get('/fetchImage/:id' , UploadImageController.fetchImage );
//router.get('/fetchAllUserImages', UploadImageController.fetchAllUserImages )

//user route
router.post('/login' ,upload.array(), UserOperations.login);
router.post('/register' ,upload.array(), UserOperations.register);





module.exports = router;
