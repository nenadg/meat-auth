// simple authentication app
// dependencies
var http = require('http');
var express = require('express');
var app = express();
var server =  http.createServer(app);

var mongoose = require('mongoose');
var mongourl = require('./shared/mongourl').generate(function(url) { mongoose.connect(url) }, 'meat-auth');
var redis = require('./node_modules/connect-redis/node_modules/redis');
var redisdb = require('./shared/redisurl').generate(redis, function(client) {
    
    var config = require('./shared/config')(app, express, client); });
var router = require('./shared/router')(app);

// server start
server.listen(app.get('port'), app.get('host'));
