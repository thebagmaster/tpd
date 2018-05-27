function saychat(msg){
	client.say('#twitchplaysdark',msg);
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

function parseSuffix(num){
  if(isNaN(num)){
    var numpt = num.substring(0, num.length - 1);
    var suff = num.slice(-1).toLowerCase();
    var sufs = ['k','m','b','t','p'];
    var pos = sufs.indexOf(suff);
    if(!isNaN(numpt) && pos != -1)
      num = numpt * Math.pow(1000,++pos);
  }
  //console.log(num);
  return parseInt(num);
}

var sreplies=[
  'Your score be like ',
  'You seem to have scored ',
  'Your score is ',
  'You have scored ',
  'Your current score is ',
  'You have right around ',
  'Much points many wow : ',
  'Up to now you have scored ',
  'It seems your score is '
];

