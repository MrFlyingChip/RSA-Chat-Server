var express = require('express');
const bodyParser = require('body-parser');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    require('./app/routes')(app, database);
    app.listen(3000, function () {
        console.log('Server app listening on port 3000!');
    });
});