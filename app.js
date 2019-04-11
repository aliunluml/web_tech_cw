const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();

//Set up EJS rendering
app.set('view engine', 'ejs');

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Catch all requests that comply with the todos API routes
require('./server/routes')(app);

app.use('/test', (req, res) => {
  res.render('test.ejs',{test: "Testing1"});
});

app.use('/test2', (req, res) => {
  res.render('test2.ejs',{test: "Testing2"});
});

app.use('/test3', (req, res) => {
  res.render('test3.ejs',{test: "Testing3"});
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
