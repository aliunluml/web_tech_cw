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

// Serving static files in the public folder
app.use(express.static(__dirname + '/public'));


function checkLogin(req, res, next){
   if(req.session.user){
     next();     //If session exists, proceed to page
   }
   else{
     var err = new Error("Not logged in!");
     next(err);  //Error, trying to access unauthorized page!
   }
}

function loginRedirect(err, req, res, next) {
  console.log(err);
  res.redirect('/login');
}

function continueWithNoLogin(err, req, res, next) {
  console.log(err);

  if (req.method === "GET") {
    console.log("Rendering");
    if (req.originalUrl==='/login') {
      res.render('login.ejs',{
        logged:"false",
      });
    }
    else if(req.originalUrl==='/signup') {
      res.render('signup.ejs',{
        logged:"false",
        message: ""
      });
    }
    else if (req.originalUrl==='/privacy') {
      res.render('privacy.ejs',{
        logged:"false",
        lastModified: {string: "21/05/2019", datetime: "2019-05-21",},
      });
    }
    else if (req.originalUrl==='/tos') {
      res.render('tos.ejs',{
        logged:"false",
        lastModified: {string: "21/05/2019", datetime: "2019-05-21",},
      });
    }
    else if (req.originalUrl==='/') {
      res.render('index.ejs',{
        logged:"false",
      });
    }
    // Bad requests with GET
    else {
      res.status(404);
      res.render('error.ejs',{
        logged:"false",
        errorMessage: "404 Not found"
      });
    }
  }
  else if(req.method === "POST"){
    if (req.originalUrl==='/signup' || req.originalUrl==='/login') {
      console.log("Proceeding");
      next();
    }
    // Bad requests with POST
    else{
      res.status(404);
      res.render('error.ejs',{
        logged:"false",
        errorMessage: "404 Not found"
      });
    }
  }
  // Bad requests with DELETE, PUT, etc.
  else {
    res.status(404);
    res.render('error.ejs',{
      logged:"false",
      errorMessage: "404 Not found"
    });
  }
}


// Catch all requests that comply with the todos API routes
require('./server/routes')(app, checkLogin, loginRedirect, continueWithNoLogin);


app.get('/logout', checkLogin, (req, res) => {
   req.session.destroy(() => {
      console.log("User logged out.")
   });
   res.redirect('/login');
});
app.use('/logout', checkLogin, loginRedirect);


app.get('/privacy', checkLogin, (req, res) => {
  res.render('privacy.ejs',{
    logged:"true",
    lastModified: {string: "21/05/2019", datetime: "2019-05-21",},
  });
});
app.use('/privacy', checkLogin, continueWithNoLogin);


//document.lastModified outputs the last time the html document is rendered
//via EJS, thus, outputting the last date of access.
app.get('/tos', checkLogin, (req, res) => {
  res.render('tos.ejs',{
    logged:"true",
    lastModified: {string: "21/05/2019", datetime: "2019-05-21",},
  });
});
app.use('/tos', checkLogin, continueWithNoLogin);


app.get('/', checkLogin, (req, res) => {
  res.render('index.ejs',{logged:"true",});
});
app.use('/', checkLogin, continueWithNoLogin);


// Setup a default catch-all route that displays the 404 Not Found page.
app.use('*', checkLogin, (req, res) => {
  res.status(404);
  res.render('error.ejs',{
    logged:"true",
    errorMessage: "404 Not found"
  });
});
app.use('*', checkLogin, continueWithNoLogin);


module.exports = app;
