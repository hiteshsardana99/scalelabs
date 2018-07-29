
//default libraries
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
//custome libraries
const User    = require('../models/userModel');
const keys    = require('../config/keys')


//register account
exports.register = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var confPassword = req.body.confirmPassword;

  if( email != null && password != null && confPassword != null && password.length > 0 && password.length > 0 && typeof email == "string" && typeof password == "string" && typeof confPassword == "string") {

      email = email.toLowerCase();

      if(password != confPassword) {
        console.log('password and confirmPassword not match');
        return res.render('register' , { msg : 'Password and confirm password not match'});
      }

      User.findOne({'userEmailId' : email}).then( existingUser => {
        console.log('check',existingUser);
        if(existingUser) {
          console.log("User already exist");
          res.render('register' , { msg : 'User already exist'});
        }
        else{
          bcrypt.hash(password, 10, function(err, encriptedPassword) {
              			// Store hash in database
              			if(err){
                			console.log(err);
                			return res.render('register' , { msg : 'Error'});
              			}
              			else{
                      User.create({'userEmailId' : email, 'userPassword' : encriptedPassword}, function(err, resp) {
                          if(err){
                            console.log(err);
                            //res.status(401).json({'status' : 100});
                            res.render('register' , { msg : 'Error'});
                          }
                          else {
                            console.log('successfully account created');
                            // res.sendFile(path.join(__dirname, './views', 'register.html'));
                            res.render('register' , { msg : 'successfully account created'});
                            // res.status(201).json({'status' : 200});
                          }
                      });
                    }
          });
        }
      });

  }
  else {
      console.log('Invalid received paramters for create account');
      // res.status(400).json({'status' : 100});
      res.render('register' , { msg : 'Invalid paramters received'});
  }
}


exports.login = function(req, res) {

  // console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;

  if( email != null && password != null && typeof email == "string" && typeof password == "string") {

    email = email.toLowerCase();

    User.findOne({'userEmailId' : email}).then( existingUser => {
      if(existingUser) {

        //account type validation
        if(typeof existingUser.userPassword == 'undefined') {
          return res.render('index' , { msg : 'Login with google'});
        }

          bcrypt.compare(password, existingUser.userPassword, function(err, response) {
                // res === true
                if(err){
                  console.log(err);
                  res.render('index' , { msg : 'Error'});
                }
                else if(response) {
                  //match
                   req.login(existingUser.userEmailId, function(err){
                        // console.log(err);
                        res.redirect('/home');
                    });

                }
                else{
                  //not match
                  console.log('Login failed : Password not match');
                  res.render('index' , { msg : 'Invalid username and password'});
                }
          });
      }
      else{
        console.log('Login failed : Invalid user credentials');
        res.render('index' , { msg : 'User not exist'});
      }
    });
  }
  else {
      console.log('Invalid received paramters for create account');
      res.render('index' , { msg : 'Invalid Entry'});
  }

}
