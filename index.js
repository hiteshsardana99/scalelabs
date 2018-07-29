//default dependencies
const express       = require('express');
const path          = require('path');
const multer        = require('multer');
const redirect      = require('express-redirect');
const ejs           = require('ejs');
const mongoose      = require('mongoose');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const session       = require('express-session');
const passport      = require('passport');

//custome dependencies
const apiRoute        = require('./routes/api');
const keys            = require('./config/keys');

//initialize services
require('./helper/passportService');

//connection to database
mongoose.connection.openUri(keys.MongoURI, { useNewUrlParser: true }, function(err, db) {
    if (err) {
        console.log('Unable to connect to the MLAB server. Please start the server. Error:', err);
    } else {
        console.log('Connected to MLAB Server successfully!');
    }
});



//creating express object
var app = express();

// app.use(express.static('./public'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from html forms
app.use(cors());//Use cors
app.set('view engine', 'ejs'); //set up ejs for templating

app.use(session({
  secret: keys.sessionKey,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/', apiRoute);

redirect(app);

//port intialization for intializing
//const port = process.env.PORT || 3000;

//server listening at 3000 port
app.listen(3000, () => {
  //console.log('server listening at ', port);
  console.log('stated');
});
