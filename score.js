app.post('/dono', function(req,res){
	console.dir(req.body);
	var type = req.body.type;
	var usr = req.body.user.toLowerCase();
	var amt = req.body.amt;

	if(type==='bits')
		amt*=1000;
	else if(type==='money')
		amt*=100000;
	else if(type==='host')
		amt=amt*100;
	else if(type==='follow')
		amt=500;
	else if(type==='sub')
		amt*=10000;

	giveScore(usr,amt);
	donos.insert({user:usr,amt:amt,time:new Date(),type:type});
	res.send('given '+usr+' '+amt+' score');
});

app.get('/score',function(req,res){
  users.find({user:{$nin:['twitchplaysdark','nightbot']}},{sort:{score:-1},limit:5}).then((docs)=>{
		res.send(docs);
	});
});

function payoutTax(user,payout){
	var tax = parseInt(payout * 0.05);
	payout-=tax;
	users.update(
			{user:user},
			{$inc: {score: payout}},
			{upsert: true});
	pots.update(
			{pot:'tax'},
			{$inc: {score: tax}},
			{upsert: true});
}

function hasEnough(user,amt,cb){
	users.findOne({user:user},'score').then((doc)=>{
		cb(doc.score >= amt)
	});
}

function purchase(user,amt,cb){
	hasEnough(user,amt,function(has){
		if(has)
			users.update(
					{user:user},
					{$inc: {score: -amt}},
					{upsert: true});
		cb(has);
	});
}

function processScore(from,msg){
	function updateScoreEmit(from,msg){
		var inc = ( from.mod || from.subscriber ) ? 10 : 1;
		users.update(
				{user: from.username},
				{$inc: {score: inc}},
				{upsert: true}
				).then(()=>{
			users.findOne({user:from.username}).then((doc)=>{
				io.emit('chat message', {from:from.username, msg:msg, score:doc.score, doc:doc});
				console.log(from.username,msg);
			})
		});
	}
	function gamble(from,msg){
		let matches = msg.match(/\!gamble\s+(\d+[kKmMbBtTpP]*)\:(\d+[kKmMbBtTpP]*)\s+(\d+[kKmMbBtTpP]*)/);
		//console.log('gambling');
		if(matches != null){
			users.findOne({user:from},'score').then((doc)=>{
				let bet = parseInt(parseSuffix(matches[3]));
				let large = parseFloat(parseSuffix(matches[2]));
				let small = parseFloat(parseSuffix(matches[1]));
				if (small > large || bet == 0 || doc.score < bet){
					saychat('Nice try... No bet for you!');
					return;
				}
				let roll = Math.random();
				let perc = 1.0 - small/large;
				if (roll >= perc){
					let payout = parseInt(bet*large/small - bet);
					saychat('You WIN! Score Gained: '+abbreviateNumber(payout));
					payoutTax(from,payout);
				}else{
					saychat('You lose. You rolled ' + 
							roll.toFixed(2) + 
							', Needed above ' + 
							perc.toFixed(2));
					users.update(
							{user:from},
							{$inc: {score: -bet}},
							{upsert: true});
				}
			});
		}
	}
	function getScore(from,msg){
		if(msg.match(/\!score/)!=null)
			users.findOne({user: from},'score').then((doc)=>{
				saychat(sreplies[Math.floor(Math.random()*sreplies.length)] + doc.score);
			});
	}
	function getTax(from,msg){
		if(msg.match(/\!pot/)!=null)
			pots.findOne({pot: 'tax'},'score').then((doc)=>{
				saychat('The pot is at : ' + doc.score);
			});
	}
	function getLotto(from,msg){
		if(msg.match(/\!lotto/)!=null)
			pots.findOne({pot: 'lotto'},'_total').then((doc)=>{
				saychat('The lotto is at : ' + doc._total);
			});
	}
	function buyLotto(from,msg){
		var matches = msg.match(/\!buy\s*lotto\s*(\d+[kKmMbBtTpP]*)/);
		if(matches!=null){
			var amt = parseInt(parseSuffix(matches[1]));
			purchase(from,amt,function(success){
				if(success){
				pots.update(
					{pot:'lotto'},
					{$inc: {_total: amt, [from]: amt}},
					{upsert: true, safe: false}).then(()=>{
																									pots.findOne({pot: 'lotto'},['_total',from]).then((doc)=>{
																										saychat('You bought ' + abbreviateNumber(amt) + 
																												' tickets. You currently have : ' + doc[from] +
																												'/' + doc._total);
																									});
																								});
				}else{
					saychat('Not enough points!');
				}
			});
		}
	}

	function buyIcon(from,msg){
		var matches = msg.match(/\!buy\s*icon\s*(\d+)/);
		if(matches!=null){
			purchase(from,10000,function(success){
				if(success){
					var num = parseInt(matches[1]);
					users.update(
							{user:from},
							{
								$addToSet:{icons:num},
								$set:{icon:num}
							},
							{upsert: true});
				}else
					saychat('Not enough monaayy!');
			});
		}
	}

	function buyStyle(from,msg){
		var matches = msg.match(/\!buy\s*style\s*(\w+)/);
		if(matches!=null){
			purchase(from,100000,function(success){
				if(success){
					var st = matches[1];
					users.update(
							{user:from},
							{
								$addToSet:{styles:st},
								$set:{style:st}
							},
							{upsert: true});
				}else
					saychat('Not enough monaayy!');
			});
		}
	}

	function tpdgive(from,msg){
		if(from == 'twitchplaysdark'){
			var matches = msg.match(/\!give\s*(\w+)\s+(\d+[kKmMbBtTpP]*)/);
			if(matches!=null){
				var amt = parseInt(parseSuffix(matches[2]));
				var usr = matches[1];
				giveScore(usr,amt);
			}
		}
	}

	function playSound(from,msg){
		var matches = msg.match(/\!sound\s*(.+)$/);
		if(matches!=null){
			purchase(from,1000,function(success){
				if(success){
					var s = matches[1];
					io.emit('play sound', {from:from, sound:s});
				}else
					saychat('Not enough monaayy!');
			});
		}
	}

	updateScoreEmit(from,msg);
	gamble(from.username,msg);
	getScore(from.username,msg);
	getTax(from.username,msg);
	getLotto(from.username,msg);
	buyLotto(from.username,msg);
	buyIcon(from.username,msg);
	buyStyle(from.username,msg);
	tpdgive(from.username,msg);
	playSound(from.username,msg);
}

function giveScore(usr,amt){
	users.update(
			{user:usr},
			{
				$inc:{score:amt}
			},
			{upsert: true});
}
