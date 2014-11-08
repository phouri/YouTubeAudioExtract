/**
 * Created by pinha_000 on 11/8/14.
 */
var express = require('express'),
    restHandler = require('./restHandler'),
    config = require('../config/config.json'),
    http = require('http'),
    bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:false}))
    .use('/fetch', function(req,res,next) {
        var url = req.param('url');
        restHandler.onUrl(url, function(err, path) {
            res.send('Saved song into ' + __dirname + path);
        });
    })
    .use(express.static('./src/client'));

app.use(function(err, req,res,next) {
    res.status(500).send(err);
});
app.listen(config.port, function() {
    console.log('Listening on ', config.port,'To start using go to: http://localhost:' + config.port + '/index.html');
});