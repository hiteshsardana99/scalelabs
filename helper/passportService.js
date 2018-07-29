//default libraries
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//custome libraries
const keys = require('../config/keys');
const User = require('../models/userModel');


passport.serializeUser(function(userEmailId, done) {
  done(null, userEmailId);
});

passport.deserializeUser(function(userEmailId, done) {
    User.findOne({'userEmailId' : userEmailId}).then( existingUser => {
      if(existingUser) {
          done(null, existingUser.userEmailId);
      }
      else{
        done(null, null);
      }
    });
});

passport.use(new GoogleStrategy(
    {
    clientID : keys.googleClientId,
    clientSecret : keys.googleClientSecret,
    callbackURL : '/auth/google/callback'
    },
    (accessTocken, refreshTocken, profile, done) => {

      User.findOne({ "userEmailId" : profile.emails[0].value }).then(existingUser => {
        if(existingUser){
          //we already have a record with the given email ID
          //first param - Error
          console.log('already registered');
          done(null,existingUser.userEmailId);
        }
        else{
          //creating new User
          new User({
            "userName" : profile.displayName,
            "userEmailId" : profile.emails[0].value,
            "signInStatus" : 1
          }).save()
          .then(user => done(null,user.userEmailId));
        }
      });
    }
));
