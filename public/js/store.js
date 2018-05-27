$( document ).ready(function() {
	icons.forEach(function(icon,i){
		$('#icons').append('<div class=icon title='+i+'>'+icon+'<div class=ino>'+i+'</div></div>');
	});
	styles.forEach(function(st,i){
		$('#styles').append('<div class="st '+st+'" title='+st+'>'+st+'</div>');
	});
	Object.keys(sounds.darksouls).forEach(function(s,i){
		$('#sounds').append('<span class="sound" title="darksouls:'+s+'" onclick=\"sounds.darksouls[\''+s+'\'].play();\">'+s+'</span>');
	});
	Object.keys(sounds.meme).forEach(function(s,i){
		$('#sounds').append('<span class="sound" title="meme:'+s+'" onclick=\"sounds.meme[\''+s+'\'].play();\">'+s+'</span>');
	});
	Object.keys(sounds.nukeum).forEach(function(s,i){
		$('#sounds').append('<span class="sound" title="nukeum:'+s+'" onclick=\"sounds.nukeum[\''+s+'\'].play();\">'+s+'</span>');
	});

	function showbox(msg,e){
		$('.tooltip')
			.html(msg+'<br>COPIED!')
			.fadeIn()
			.css(({ left: e.pageX, top: e.pageY }));
	}

	function hidebox(){
		$('.tooltip').fadeOut();
	}

	function copytxt(msg,e){
		var txt = document.getElementById('copycmd');
		txt.value = msg;
		txt.select();
		document.execCommand("Copy");
		showbox(msg,e);
		setTimeout(hidebox,2000);
	}

	$('.icon').click(function(e){
		copytxt('!buy icon '+$(this).attr('title'),e);
	});
	$('.st').click(function(e){
		copytxt('!buy style '+$(this).attr('title'),e);
	});
	$('.sound').click(function(e){
		copytxt('!sound '+$(this).attr('title'),e);
	});

});
