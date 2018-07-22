

//default libraries
const multer =  require('multer');
const path = require('path');


//set storage engine
const storage = multer.diskStorage({
  destination : 'public/uploads/',
  filename : function(req, file, callback){
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//check file type
function checkFileType(file,callback) {
  //allowed extension
  const fileTypes  = /jpeg|jpg|png|gif/;
  //check extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mimeType
  const mimetype = fileTypes.test(file.mimetype);

  if(extname && mimetype) {
    return callback(null,'true');
  } else {
    callback('Error : Images only!')
  }
}


// Init upload
exports.uploadImage = multer({
  storage : storage,
  limits : {fileSize : 6*1000*1000},
  fileFilter : function(req,file,callback){
    checkFileType(file,callback);
  }
}).single('myImageName');
