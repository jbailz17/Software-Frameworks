const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '../chatApp/dist')));
app.use('/images', express.static(path.join(__dirname, './profileImages')));

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//  Connect to the mongo database
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if(err) {
        return console.log('An error occurred: ' + err);
    }

    const dbName = 'chatApp';
    const db = client.db(dbName);

    // Setup routes
    require('./routes.js')(app, path, db, formidable);
    // Setup sockets
    require('./socket.js')(app, io);
    // Start server
    require('./listen.js')(http);
});
