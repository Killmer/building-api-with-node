var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var path = require('path');

var db = require('./db');
var artistsController = require('./controllers/artists');
var photosController = require('./controllers/photos');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

 const views = (fileName) => {
     return path.join(__dirname + `/views/${fileName}.html`);
 };

 // serves up static files from the frontend folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function (req, res) {
    res.sendFile(views('index'));
});

app.get('/add-artist', function (req, res) {
    res.sendFile(views('add-artist'));
});

app.get('/api/artists', artistsController.all);

app.get('/api/artists/:id', artistsController.findById);

app.post('/api/artists', 
    photosController.upload,
    photosController.resize,
    artistsController.create
);

app.put('/api/artists/:id', 
    photosController.upload,
    photosController.resize,
    artistsController.update
);

app.delete('/api/artists/:id', artistsController.delete);

db.connect('mongodb://localhost:27017/myapi', function (err) {
    if (err) {
        return console.log(err);
    }
    app.listen(3012, function () {
        console.log('API app started')
    });
});