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


app.use('/logout', (req, res) => {
   req.session.destroy(() => {
      console.log("User logged out.")
   });
   res.redirect('/login');
});

app.use(express.static(__dirname + '/public'));


app.get('/privacy', (req, res) => {
  res.render('privacy.ejs',{lastModified: {string: "21/05/2019", datetime: "2019-05-21",},});
});

//document.lastModified outputs the last time the html document is rendered
//via EJS, thus, outputting the last date of access.
app.get('/tos', (req, res) => {
  res.render('tos.ejs',{lastModified: {string: "21/05/2019", datetime: "2019-05-21",},});
});

app.get('/', (req, res) => {
  res.render('index.ejs',{});
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => {
  res.status(404);
  res.render('error.ejs',{errorMessage: "404 Not found"});
});

module.exports = app;
