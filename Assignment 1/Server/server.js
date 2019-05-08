const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, '../chatApp/dist')));
require('./routes.js')(app, path);


require('./socket.js')(app, io);
require('./listen.js')(http);
