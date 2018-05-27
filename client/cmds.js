var robot = require("robotjs");
robot.setKeyboardDelay(0);
const uuidV4 = require('uuid/v4');

function Commands() {
	this.dic = {};
	this.togs = {};

	this.process = function(msg){
		var words = msg.split(' ');
		var exed = [];
		for(i in words){
			if(words[i] in this.dic){
				let uuid = uuidV4();
				io.emit('cmd start', {cmd:words[i],uuid:uuid});
				this.dic[words[i]]();
				io.emit('cmd stop', {cmd:words[i],uuid:uuid});
				exed.push(words[i]);
			}
		}
		return exed;
	};

	this.delay = function(dly){
		dly *= 16 //60fps
		var waitTill = new Date(new Date().getTime() + dly);
		while(waitTill > new Date()){}
	};

	this.press = function(cmd){
		var key = cmd.slice(0, -1);
		var dn = cmd.slice(-1)=='d'?'down':'up';
		robot.keyToggle(key,dn);
		//sendInput(keycode,dn or up)
	};

	this.toggle = function(cmd){
		var t = this.togs[cmd];
		if(t[0])
			this.runall(t[1]);
		else
			this.runall(t[2]);
	};

	this.runall = function(funcs){	
		for(i in funcs){
			funcs[i]();
		}
	};

	this.readcmdl = function(cmdl){
		var cmds = cmdl.split(",");
		var funcs = [];
		for(j in cmds){
			var cmd = cmds[j];
			if(/^[0-9]+$/.test(cmd))
			{
				funcs.push(function(){
					this.dly(parseInt(cmd))
				});
			}
			else if(/^\w+[du]$/.test(cmd))
			{
				funcs.push(function(){
					this.press(cmd);
				});
			}
		}
		return funcs;
	};

	this.read = function(file){
		filePath = path.join(__dirname, file);
		var data = fs.readFileSync(filePath,'utf8');
		var lines = data.toString().split("\n");
		for(i in lines){
			if(lines[i] == "" || lines[i][0] == '#')
				continue;
			var line = lines[i].split(":");
			var key = line[0];
			var cmdl = line[1];
			var run;

			if(/^\w+\s\w+$/.test(cmdl) && 
					't' == key.charAt(0))
			{
				var cmds = cmdl.split(" ");
				var funcf = function(){
					this.readcmdl(cmds[0]);
				};
				var funct = function(){
					this.readcmdl(cmds[1]);
				};
				this.togs[key] = (false,funcf,funct);
				run = function(){
					this.toggle(key);
				};
			}
			else
			{
				var funcs = this.readcmdl(cmdl);
				run = function(){
					this.runall(funcs);
				};
			}
			this.dic[key]=run;
		}
	};
}
