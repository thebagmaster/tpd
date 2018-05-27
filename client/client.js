//___________________________________________________
//webserver
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var fs = require('fs');
var socket = require('socket.io-client')('http://192.168.1.100:7777');

app.use(express.urlencoded());
app.use(express.json());

eval(fs.readFileSync('./cmds.js','utf8'));

var c = new Commands();
c.read('darksouls.cmds');

console.log(c.dic);

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	console.log('user disconnected');
	});
});

socket.on('chat message', function(data){
	c.process(data.msg);
});


server.listen(7776);
