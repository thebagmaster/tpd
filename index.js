//___________________________________________________
//webserver
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var fs = require('fs');
var ipfilter = require('express-ipfilter').IpFilter;

var ips = ['127.0.0.1',
		'192.168.1.100',
		'70.88.5.49',
		'192.168.1.69',
		'192.168.1.70',
		'192.168.1.110'];
app.use(express.urlencoded());
app.use(express.json());
app.use(ipfilter(ips, {mode: 'allow'}));
app.use(express.static(path.join(__dirname, 'public')));

const db = require('monk')('192.168.1.100/tpd');
const chat = db.get('chat');
const users = db.get('users');
const pots = db.get('pots');
const donos = db.get('donos');

eval(fs.readFileSync('./helpers.js','utf8'));
eval(fs.readFileSync('./chat.js','utf8'));
eval(fs.readFileSync('./score.js','utf8'));
eval(fs.readFileSync('./twitchapi.js','utf8'));

app.use("/", express.static(__dirname + '/public/index.html'));

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	console.log('user disconnected');
	});
});

server.listen(7777);




