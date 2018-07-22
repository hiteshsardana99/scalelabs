
//default libraries
const express = require('express');
const router = express.Router();
//custome libraries
const UploadImageController = require('../controllers/uploadImage');


//add restrictions in api
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});


router.post('/uploadImage' , UploadImageController.uploadImage );


module.exports = router;
