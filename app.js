var express = require('express');
var app = express();

app.set('view engine', 'ejs');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/handleForm', (req, res) => {
	var name = req.body.username;
	var animals = [].concat(req.body.animal);
	// console.log(animals);
	res.render('showAnimals.ejs', { name: name, animals: animals });

    });


app.use('/public', express.static('public'));


app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
