var twitchemotes = {};
$.getJSON( "json/all.json", function( data ) {
  twitchemotes=data;
});
for(var i = 0; i < 11; i++)
  addChat({score:'',msg:' ',from:'',doc:{}});
for(var i = 0; i < 5; i++)
  addDono(':<br>:');
 
function emoteparse(str){
  var words = str.split(" ");
  for(var i = 0; i < words.length; i++){
    if(twitchemotes.hasOwnProperty(words[i]))
      words[i] = "<img src=https://static-cdn.jtvnw.net/emoticons/v1/"+twitchemotes[words[i]]+"/1.0>";
  }
  return words.join(" ");
}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b","t","p"];
    var suffixNum = Math.floor( (""+value).length/3 );
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
    newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

var socket = io();
socket.on('chat message', function(msg){
  addChat(msg);
});
socket.on('play sound', function(msg){
  var sp = msg.sound.split(':');
	sounds[sp[0]][sp[1]].play();
	addDono("🔊 " + msg.from + "<br>" + sp[1]);
});

var cmdsocket = io.connect('192.168.1.110:7776');
cmdsocket.on('cmd start', function(cmd){
	$('.activecmd').append('<div class="cmd "'+cmd.uuid+'">'+cmd.cmd+'</div>');
});
cmdsocket.on('cmd stop', function(cmd){
	$('.' + cmd.uuid).remove();
});

function addChat(msg){
  var $div = $('#messages');
  for(var i = 0; i <= $div.find('li').length - 10; i++)
    $div.find('li:nth-child('+i+')').slideUp("normal", function() { $(this).remove(); } );
  //console.log(msg.doc);
  var style = (msg.doc.hasOwnProperty('style')) ? msg.doc.style:'';
  var icon = (msg.doc.hasOwnProperty('icon')) ? msg.doc.icon:-1;
  $('<li class="list-group-item justify-content-between" style="display:none">')
    .html(
        '<span class="badge badge-default badge-pill">' + 
        abbreviateNumber(msg.score) + 
        '</span>' +
        (icon>0?icons[icon]:'') +
        ' <span class='+style+'>'+
        msg.from + 
        '</span>'+
        ": " + 
        emoteparse( msg.msg )
        )
    .appendTo($div)
    .slideDown();
}

function addDono(msg){
  var $div = $('#donos');
  for(var i = 0; i <= $div.find('li').length - 4; i++)
    $div.find('li:nth-child('+i+')').slideUp("normal", function() { $(this).remove(); } );
  //console.log(msg.doc);
  $('<li class="list-group-item justify-content-between" style="display:none">')
    .html(msg)
    .appendTo($div)
    .slideDown();
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubePlayerAPIReady() {
	player = new YT.Player('juke', {
		height: '145',
		width: '258',
		videoId: 'ffLbdhP0auc',
		showinfo: 0,
		playerVars: { 'autoplay': 1, 'loop':1 },
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
  $('.juke-title').html(event.target.getVideoData().title);
	if (event.data == YT.PlayerState.ENDED) {
		//do shit
	}
}
														                        
function getTop(){
	$.get('/score',function(data){
		var $tp = $('.top-points');
		$tp.empty();
		$tp.append('<li><span class=leader-title>Leaderboard</span></li>');
		for(var i in data){
			$tp.append("<li><span class='badge badge-default badge-pill'>"+
				  abbreviateNumber(data[i]['score'])+
					'</span><span class=user>'+
					data[i]['user']+
					'</span></li>');
		}
	});
}
setInterval(getTop,2000);

var alerttime = setTimeout(function(){},100);
function streamlab(msg){
	clearTimeout(alerttime);
	$a = $('.alertbox');
	$a.fadeIn(1000);
	$a.html(msg);
	alerttime = setTimeout(
			function(){
				$a.fadeOut(1000);
			},4000);
}

var donoimgs = [
	'img/creator.gif',
	'img/dance.gif',
	'img/gaping.gif',
	'img/meh.gif',
	'img/onion.gif',
	'img/praise.gif'
];
var donoq = [];
function deqdono(){
	if(donoq.length > 0){
		var dono = donoq[0];
		var $gif = $('<div class="gif"><img src="'+
				donoimgs[Math.floor(Math.random()*donoimgs.length)]+
				'"</div>');
		$('body').append($gif);
		setTimeout(function(){$gif.fadeOut(1000, function() { $(this).remove();donoq.shift(); });},5000);
		var dsounds = Object.keys(sounds.darksouls);
		var rsound = dsounds[Math.floor(Math.random()*dsounds.length)];
		sounds.darksouls[rsound].play();
		streamlab(dono);
	}
}
var donoi = setInterval(deqdono,7000);
function qdono(msg){
	donoq.push(msg);
	if(donoq.length==1){
		clearInterval(donoi);
		donoi = setInterval(deqdono,7000);
		deqdono();
	}
}
function connectDono(){
	var streamlabs = io('https://sockets.streamlabs.com?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjRCQTVBNEM2OTYwMDk5N0VDOUFEIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiOTg5OTIwMDMifQ.pPgCGoEawFUmSEQ7TkT-4P9L2IMMhJlNYEjrrlmwmwc', {transports: ['websocket']});
	streamlabs.on('event', (eventData) => {
		dono = {};
		var msg = eventData.message[0];
		switch(eventData.type) {
			case 'donation':
				qdono(msg.name+' has donated '+msg.formatted_amount+
						'<br>'+msg.message);
				$.post('/dono',{user:msg.name,type:'money',amt:msg.amount},function(res){console.log(res)});
				addDono('💵 '+msg.name+'<br>'+msg.formatted_amount);
				break;
			case 'follow':
				qdono(msg.name+' has Followed');
				$.post('/dono',{user:msg.name,type:'follow',amt:1},function(res){console.log(res)});
				addDono('🧡 '+msg.name+'<br>follow');
				break;
			case 'subscription':
				qdono(msg.name+' has Subscribed for '+msg.months+' Months!' );
				$.post('/dono',{user:msg.name,type:'sub',amt:msg.months},function(res){console.log(res)});
				addDono('🥪 '+msg.name+'<br>sub '+msg.months+' months');
				break;
			case 'host':
				qdono(msg.name+' has Hosted with '+msg.viewers+' Viewers!' );
				$.post('/dono',{user:msg.name,type:'host',amt:msg.viewers},function(res){console.log(res)});
				addDono('🎉 '+msg.name+'<br>host  '+msg.viewers);
				break;
			case 'bits':
				qdono(msg.name+' has Donated '+msg.amount+' Bits!'+
						'<br>'+msg.message);
				$.post('/dono',{user:msg.name,type:'bits',amt:msg.amount},function(res){console.log(res)});
				addDono('💎 '+msg.name+'<br>'+msg.amount+' bits');
				break;
			case 'raid':
				qdono(msg.name+' has Raided us with '+msg.raiders+' Raiders!');
				$.post('/dono',{user:msg.name,type:'host',amt:msg.raiders},function(res){console.log(res)});
				addDono('🐛 '+msg.name+'<br>raid '+msg.raiders+'');
				break;
			default:
				console.log(msg);
		}
	});
}

connectDono();
