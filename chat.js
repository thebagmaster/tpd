//___________________________________________________
//irc
var request = require("request");
var CronJob = require('cron').CronJob;
var tmi = require("tmi.js");
var client = new tmi.client({
	identity: {
		username: "twitchplaysdark",
		password: "oauth:htntbmmg54idq1mnx6kzoivk63krtd"
	},
	channels: ["#twitchplaysdark"]
});
client.connect();

client.on("chat", function (channel, user, msg, self) {
	processScore(user,msg);  
	chat.insert({time:new Date(),from:user.username,msg:msg});
});

var views = [];
var mods = [];

new CronJob('*/5 * * * *',function(){
	//client.send('NAMES', '#twitchplaysdark');
	request({
		url: 'http://tmi.twitch.tv/group/user/twitchplaysdark/chatters',
		json: true
	}, function (error, response, body) {
		var bmods = body.chatters.moderators;
		var bviews = body.chatters.viewers;
		var scored1 = bmods.filter((n) => mods.includes(n));
		var scored2 = bviews.filter((n) => views.includes(n));
		var scored = scored1.concat(scored2);
		for(i in scored)
			users.update(
					{user:scored[i]},
					{$inc: {score: 1}},
					{upsert: true, safe: false});
		mods = bmods;
		views = bviews;
	})
},null,true,'America/Chicago');
