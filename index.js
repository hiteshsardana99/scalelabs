//default dependencies
const express = require('express');
const path = require('path');
const multer = require('multer');
const redirect = require('express-redirect');
const ejs = require('ejs');
const mongoose = require('mongoose');

//custome dependencies
const apiRoute = require('./routes/api');
const keys = require('./config/keys');


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


app.set('view engine', 'ejs');

// public folder
app.use(express.static('./public'));

/* GET Home Page  */
app.get('/', (req,res) => {
    // res.sendFile(path.join(__dirname, './views', 'index.html'));
    console.log('home');
    res.render('home');
});

app.use('/api', apiRoute);

redirect(app);


//server listening at 3000 port
app.listen(3000, () => {
  console.log('server listening at 3000 port');
});
