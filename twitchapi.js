//twitch API
//____________________________________________________
const request = require("request");
var client_id = '3m7jl41mhdf4hddp8b9rvt0r2qwrak';
var secret = 'jimwt69qj503oyiyvv9q34st4fmk7d';
var access_token = '';
var tpduid = '98992003';

if(false)
request.post('https://api.twitch.tv/kraken/oauth2/token',
    {form:{
    client_id:client_id,
    client_secret:secret,
    grant_type:'client_credentials'
  }},function(err,res,body){
    var r = JSON.parse(body);
    access_token = r.access_token;
    console.log(body);
    //request({url:'https://api.twitch.tv/kraken/channels/'+tpduid+'/subscriptions',
    //          headers:{
    //            'Accept':'application/vnd.twitchtv.v5+json',
    //            'Client-ID':client_id,
    //            'Authorization':'OAuth '+access_token
    //          }
    //        },function(e,r,b){
    //          console.log(b);
    //        });
  });

var streamlabsCred = {
	clientID: '9KQmIdZjmBZEXEzAujOlInRuRETGQZm9qMqKh3fN',
	clientSecret: 'aaTwJSRndmvvOf684iroNbDzDdXXAtH9URn4M73C',
	tokenURL: 'https://streamlabs.com/api/v1.0/token',
	authorizationURL: 'https://streamlabs.com/api/v1.0/authorize',
	callbackURL: 'http://danserver.chickenkiller.com/auth/callback',
	scopes: ['socket.token','donations.read','points.read']
};

app.get('/auth/code',function(req,res){
	console.log(req.query.code);
	res.send(req.query.code);
});

app.post('/getdonotoken',function(req,res){

});
