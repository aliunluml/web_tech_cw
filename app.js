//Use dotenv for configuring environment variables
require('dotenv').config()

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const helmet = require('helmet')
var session = require('express-session');

//Set up the express app
const app = express();

//Use helmet for setting HTTP headers appropriately for security
app.use(helmet())

//Set up EJS rendering
app.set('view engine', 'ejs');

//Use layout support for EJS rendering
app.use(expressEjsLayouts);

//Log requests to the console
app.use(logger('dev'));

//Use sessions to assign the requests from a client an id and to store data
//associated with that id on the serverside
app.use(session({secret: process.env.SECRET_KEY}));
//Default values are saveUninitialized: true, resave: true
//Our type of usage is deprecated, thus, we have the warning. If we explicitly,
//state their default values, warning should be gone. However, I would like
//to see the warning for now so did not change it.
//See https://stackoverflow.com/questions/24477035/express-4-0-express-session-with-odd-warning-message

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Catch all requests that comply with the todos API routes
require('./server/routes')(app);

app.get('/signup', (req, res) => {
  res.render('signup.ejs',{message: ""});
});

app.get('/login', (req, res) => {
  res.render('login.ejs',{});
});

app.use('/logout', (req, res) => {
   req.session.destroy(() => {
      console.log("User logged out.")
   });
   res.redirect('/login');
});

app.use(express.static(__dirname + '/public'));

// function checkLogin(req, res, next){
//    if(req.session.user){
//       next();     //If session exists, proceed to page
//    } else {
//       var err = new Error("Not logged in!");
//       next(err);  //Error, trying to access unauthorized page!
//    }
// }

// app.get('/dashboard', checkLogin, (req, res) => {
//   res.render('dashboard.ejs',{
//     name : req.session.user.name,
//     username : req.session.user.username,
//     affiliation : req.session.user.affiliation,
//     position: req.session.user.position,
//     posts: req.session.user.
//   });
// });
//
// app.use('/dashboard', checkLogin, (err, req, res, next) => {
//   console.log(err);
//   res.redirect('/login');
// });

app.get('/privacy', (req, res) => {
  res.render('privacy.ejs',{});
});

//document.lastModified outputs the last time the html document is rendered
//via EJS, thus, outputting the last date of access.
app.get('/tos', (req, res) => {
  res.render('tos.ejs',{lastModified: {string: "15/04/2019", datetime: "2019-04-15",},});
});

app.get('/', (req, res) => {
  res.render('index.ejs',{});
});

app.get('/profile', (req, res) => {
  res.render('profile.ejs',{});
});

app.get('/corpus', (req, res) => {
  res.render('corpus.ejs',{});
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => {
  res.render('error.ejs',{});
});

module.exports = app;
