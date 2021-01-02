var id = x => document.getElementById(x);
var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
const player = {
	startPoint: [4,5,350,1],
	spawnPoint: [4,5,350,1],
	x: 0,
	y: 0,
	xv: 0,
	yv: 0,
	g: 400,
	currentJumps: 0,
	canWalljump: false,
	wallJumpDir: "left",
	maxJumps: 1,
	godMode: false,
	selectedBlock: [1,0],
};
const control = {
	lmb: false,
	rmb: false,
	left: false,
	right: false,
};
var level = [
	[1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,1,0,0,1],
	[1,0,1,1,0,0,1,0,1],
	[1,0,0,0,0,0,1,0,1],
	[1,0,1,1,0,0,1,0,1],
	[1,0,0,0,0,1,0,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1]
];
const hasHitbox = [1,5,11];
const blockName = ["Empty Space","Solid Block","Death Block","Check Point","Activated Check Point (Unavailable)","Bounce Block",
		   "G-Up Field","G-Down Field","G-Low Field","G-Medium Field","G-High Field",
		   "Wall-Jump Block","0-Jump Field","1-Jump Field","2-Jump Field","3-Jump Field","Inf-Jump Field",
		   "Start (note: save your current gravity and jump amount as the starting value)","Goal","Deactivated Start (Unavailable)","Activated Goal (Unavailable)"];
const bannedBlock = [4,19,20];

id("levelLayer").addEventListener("mousedown", function(input){
	let xb = Math.floor(input.offsetX/blockSize);
	let yb = Math.floor(input.offsetY/blockSize);
	if (input.shiftKey) {
		player.x = input.offsetX;
		player.y = input.offsetY;
		player.xv = 0;
		player.yv = 0;
		if (input.button == 1) {
			player.selectedBlock[1] = getBlockType(xb,yb);
			if (player.selectedBlock[1] == 4) player.selectedBlock[1] = 3;
			if (player.selectedBlock[1] == 19) player.selectedBlock[1] = 17;
			if (player.selectedBlock[1] == 20) player.selectedBlock[1] = 18;
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = blockName[player.selectedBlock[input.shiftKey?1:0]];
		}
	} else {
		if (input.button == 0 && !bannedBlock.includes(player.selectedBlock[0])) {
			if (player.selectedBlock[0] == 17) {
				if (level[player.spawnPoint[0]] != undefined) {
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
				}
				player.startPoint = [xb,yb,player.g,player.maxJumps];
				player.spawnPoint = [xb,yb,player.g,player.maxJumps];
			}
			level[xb][yb] = player.selectedBlock[0];
			control.lmb = true;
			drawLevel();
		} else if (input.button == 1) {
			player.selectedBlock[0] = getBlockType(xb,yb);
			if (player.selectedBlock[0] == 4) player.selectedBlock[0] = 3;
			if (player.selectedBlock[0] == 19) player.selectedBlock[0] = 17;
			if (player.selectedBlock[0] == 20) player.selectedBlock[0] = 18;
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = blockName[player.selectedBlock[input.shiftKey?1:0]];
		} else if (input.button == 2 && !bannedBlock.includes(player.selectedBlock[1])) {
			if (player.selectedBlock[1] == 17) {
				if (level[player.spawnPoint[0]] != undefined) {
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
				}
				player.startPoint = [xb,yb,player.g,player.maxJumps];
				player.spawnPoint = [xb,yb,player.g,player.maxJumps];
			}
			level[xb][yb] = player.selectedBlock[1];
			control.rmb = true;
			drawLevel();
		}
	}
});
id("levelLayer").addEventListener("mousemove", function(input){
	if (!input.shiftKey) {
		let xb = Math.floor(input.offsetX/blockSize);
		let yb = Math.floor(input.offsetY/blockSize);
		if (control.lmb && !bannedBlock.includes(player.selectedBlock[0])) {
			if (player.selectedBlock[0] == 17) {
				if (level[player.spawnPoint[0]] != undefined) {
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
				}
				player.spawnPoint = [xb,yb,player.g,player.maxJumps];
			}
			level[xb][yb] = player.selectedBlock[0];
			drawLevel();
		} else if (control.rmb && !bannedBlock.includes(player.selectedBlock[1])) {
			if (player.selectedBlock[0] == 17) {
				if (level[player.spawnPoint[0]] != undefined) {
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
					if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
				}
				player.spawnPoint = [xb,yb,player.g,player.maxJumps];
			}
			level[xb][yb] = player.selectedBlock[1];
			drawLevel();
		}
	}
});
id("levelLayer").addEventListener("mouseup", function(input){
	if (input.button == 0) {
		control.lmb = false;
	} else if (input.button == 2) {
		control.rmb = false;
	}
});
document.addEventListener("contextmenu", function(input){input.preventDefault();});

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			if (player.canWalljump) {
				if (player.wallJumpDir == "left") {
					player.xv = -1000;
					player.yv = -Math.sign(player.g)*225;
				}
				if (player.wallJumpDir == "right") {
					player.xv = 1000;
					player.yv = -Math.sign(player.g)*225;
				}
			} else if (player.currentJumps > 0 || player.godMode) {
				player.yv = -Math.sign(player.g)*225;
				player.currentJumps--;
			}
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = true;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = true;
			break;
		case "Comma":
			player.selectedBlock[input.shiftKey?1:0]--;
			if (player.selectedBlock[input.shiftKey?1:0] < 0) player.selectedBlock[input.shiftKey?1:0] = blockName.length-1;
			while (bannedBlock.includes(player.selectedBlock[input.shiftKey?1:0])) {
				player.selectedBlock[input.shiftKey?1:0]--;
				if (player.selectedBlock[input.shiftKey?1:0] < 0) player.selectedBlock[input.shiftKey?1:0] = blockName.length-1;
			}
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = blockName[player.selectedBlock[input.shiftKey?1:0]];
			break;
		case "Period":
			player.selectedBlock[input.shiftKey?1:0]++;
			if (player.selectedBlock[input.shiftKey?1:0] > blockName.length-1) player.selectedBlock[input.shiftKey?1:0] = 0;
			while (bannedBlock.includes(player.selectedBlock[input.shiftKey?1:0])) {
				player.selectedBlock[input.shiftKey?1:0]++;
				if (player.selectedBlock[input.shiftKey?1:0] > blockName.length-1) player.selectedBlock[input.shiftKey?1:0] = 0;
			}
			id("selectedBlock"+(input.shiftKey?1:0)).innerHTML = blockName[player.selectedBlock[input.shiftKey?1:0]];
			break;
		case "Minus":
			if (input.shiftKey) {
				if (level[0].length > 1) {
					for (let i in level) level[i].length--;
					id("lvlHeight").innerHTML = level[0].length;
				}
			} else {
				if (level.length > 1) {
					level.length--;
					id("lvlWidth").innerHTML = level.length;
				}
			}
			drawLevel();
			break;
		case "Equal":
			if (input.shiftKey) {
				for (let i in level) {
					level[i].push(0);
				}
				id("lvlHeight").innerHTML = level[0].length;
			} else {
				level.push([]);
				level[level.length-1].length = level[0].length;
				level[level.length-1].fill(0);
				id("lvlWidth").innerHTML = level.length;
			}
			drawLevel();
			break;
		case "KeyS":
			toStart();
			break;
		case "KeyR":
			respawn();
			break;
		case "KeyG":
			player.godMode = !player.godMode;
			drawPlayer();
			break;
		case "KeyI":
			if (id("info").style.display != "none") {
				id("info").style.display = "none";
			} else if (id("info").style.display != "inline") id("info").style.display = "inline";
			break;
		case "KeyC":
			if (id("control").style.display != "none") {
				id("control").style.display = "none";
			} else if (id("control").style.display != "inline") id("control").style.display = "inline";
			break;
		case "KeyE":
			if (input.shiftKey) {
				let data = prompt("Please enter level data.");
				if (data) {
					data = JSON.parse(data);
					level = data[0];
					player.startPoint = data[1];
					if (!player.startPoint[3]) player.startPoint[3] = 1;
					if (player.startPoint[3] == "Infinity") player.startPoint[3] = Infinity;
					id("lvlWidth").innerHTML = level.length;
					id("lvlHeight").innerHTML = level[0].length;
					toStart();
					drawLevel();
				}
			} else {
				let adjustedLevel = deepCopy(level);
				for (let x in adjustedLevel) {
					for (let y in adjustedLevel[x]){
						if (adjustedLevel[x][y] == 4) adjustedLevel[x][y] = 3;
						if (adjustedLevel[x][y] == 19) adjustedLevel[x][y] = 17;
						if (adjustedLevel[x][y] == 20) adjustedLevel[x][y] = 18;
					}
				}
				let startData = player.startPoint
				if (startData[3] == Infinity) startData[3] = "Infinity";
				id("exportArea").value = JSON.stringify([adjustedLevel,startData]);
				id("exportArea").style.display = "inline";
				id("exportArea").select();
				document.execCommand("copy")
				id("exportArea").style.display = "none";
				alert("Level data copied to clipboard!");
			}
			break;
	}
});
document.addEventListener("keyup", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowLeft":
		case "KeyA":
			control.left = false;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = false;
			break;
	}
});

function deepCopy(inObject) { //definitely not copied from somewhere else
	let outObject, value, key
	if (typeof inObject !== "object" || inObject === null) {
		return inObject
	}
	outObject = Array.isArray(inObject) ? [] : {}
	for (key in inObject) {
		value = inObject[key]
		outObject[key] = deepCopy(value)
	}
	return outObject
}
function getBlockType(x,y) {
	if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
		return 1;
	}
	return level[x][y];
}
function isTouching(dir, type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	switch (dir) {
		case "left":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && hasHitbox.includes(getBlockType(x1b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize < blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b+1,y1b))) 
			|| (hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize < y2%blockSize && !hasHitbox.includes(getBlockType(x1b+1,y2b))));
			break;
		case "right":
			return (hasHitbox.includes(getBlockType(x2b,y1b)) && hasHitbox.includes(getBlockType(x2b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize < blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b-1,y1b))) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize < y2%blockSize && !hasHitbox.includes(getBlockType(x2b-1,y2b))));
			break;
		case "up":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && hasHitbox.includes(getBlockType(x2b,y1b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b,y1b+1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b,y1b+1))))
			&& player.yv < 0;
			break;
		case "down":
			return (hasHitbox.includes(getBlockType(x1b,y2b)) && hasHitbox.includes(getBlockType(x2b,y2b)))
			|| ((hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x1b,y2b-1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x2b,y2b-1))))
			&& player.yv > 0;
			break;
		case "any":
			x1 = player.x + 1;
			x2 = player.x+playerSize - 1;
			y1 = player.y + 1;
			y2 = player.y+playerSize - 1;
			x1b = Math.floor(x1/blockSize);
			x2b = Math.floor(x2/blockSize);
			y1b = Math.floor(y1/blockSize);
			y2b = Math.floor(y2/blockSize);
			return getBlockType(x1b,y1b) == type
			|| getBlockType(x2b,y1b) == type
			|| getBlockType(x1b,y2b) == type
			|| getBlockType(x2b,y2b) == type;
	}
}
function getCoord(type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	if (getBlockType(x1b,y1b) == type) {
		return [x1b,y1b];
	} else if (getBlockType(x2b,y1b) == type) {
		return [x2b,y1b];
	} else if (getBlockType(x1b,y2b) == type) {
		return [x1b,y2b];
	} else if (getBlockType(x2b,y2b) == type) {
		return [x2b,y2b];
	}
}
function toStart() {
	player.x = player.startPoint[0] * blockSize + (blockSize - playerSize)/2;
	player.y = player.startPoint[1] * blockSize + (blockSize - playerSize)/2;
	player.xv = 0;
	player.yv = 0;
	player.g = player.startPoint[2];
	player.maxJumps = player.startPoint[3];
}
function respawn() {
	player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
	player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize)/2;
	player.xv = 0;
	player.yv = 0;
	player.g = player.spawnPoint[2];
	player.maxJumps = player.spawnPoint[3];
}

var lastFrame = 0;
var haltThreshold = 50;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	if (dt < haltThreshold) {
		let xprev = player.x;
		let yprev = player.y;
		// velocity change
		player.xv *= 0.5;
		if (Math.abs(player.xv) < 5) player.xv = 0;
		player.yv += player.g * dt / 500 * gameSpeed;
		if (player.yv > player.g && player.g > 0) player.yv = player.g;
		if (player.yv < player.g && player.g < 0) player.yv = player.g;
		// position change based on velocity
		player.x += player.xv * dt / 500 * gameSpeed;
		player.y += player.yv * dt / 500 * gameSpeed;
		// collision detection
		let x1 = player.x;
		let x2 = player.x+playerSize;
		let y1 = player.y;
		let y2 = player.y+playerSize;
		let x1b = Math.floor(x1/blockSize);
		let x2b = Math.floor(x2/blockSize);
		let y1b = Math.floor(y1/blockSize);
		let y2b = Math.floor(y2/blockSize);
		// left wall
		if (isTouching("left")) {
			player.xv = 0;
			if ((getBlockType(x1b,y1b) == 11 || getBlockType(x1b,y2b) == 11) && control.left) {
				if (player.yv > player.g/10 && player.g > 0) player.yv = player.g/10;
				if (player.yv < player.g/10 && player.g < 0) player.yv = player.g/10;
				player.canWalljump = true;
				player.wallJumpDir = "right";
			} else player.canWalljump = false;
			player.x = (x1b + 1) * blockSize;
		} else if (isTouching("right")) { // right wall
			player.xv = 0;
			if ((getBlockType(x2b,y1b) == 11 || getBlockType(x2b,y2b) == 11) && control.right) {
				if (player.yv > player.g/10 && player.g > 0) player.yv = player.g/10;
				if (player.yv < player.g/10 && player.g < 0) player.yv = player.g/10;
				player.canWalljump = true;
				player.wallJumpDir = "left";
			} else player.canWalljump = false;
			player.x = x2b * blockSize - playerSize;
		} else player.canWalljump = false;
		// ceiling
		if (isTouching("up")) {
			player.yv = 0;
			if (((getBlockType(x2b,y1b) == 5 && getBlockType(x1b,y1b) == 5)
			   || ((getBlockType(x2b,y1b) == 5 || getBlockType(x1b,y1b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y1b)) || hasHitbox.includes(getBlockType(x2b,y1b+1)))
				   || (!hasHitbox.includes(getBlockType(x1b,y1b)) || hasHitbox.includes(getBlockType(x1b,y1b+1))))))
			   && player.g < 0) player.yv = -Math.sign(player.g)*300;
			player.y = (y1b + 1) * blockSize;
			if (player.g < 0 && player.yv <= 0) player.currentJumps = player.maxJumps;
		} else if (player.g < 0 && player.currentJumps == player.maxJumps) player.currentJumps = player.maxJumps - 1;
		// floor
		if (isTouching("down")) {
			player.yv = 0;
			if (((getBlockType(x2b,y2b) == 5 && getBlockType(x1b,y2b) == 5)
			   || ((getBlockType(x2b,y2b) == 5 || getBlockType(x1b,y2b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y2b)) || hasHitbox.includes(getBlockType(x2b,y2b-1))) 
				   || (!hasHitbox.includes(getBlockType(x1b,y2b)) || hasHitbox.includes(getBlockType(x1b,y2b-1))))))
			   && player.g > 0) player.yv = -Math.sign(player.g)*300;
			player.y = y2b * blockSize - playerSize;
			if (player.g > 0 && player.yv >= 0) player.currentJumps = player.maxJumps;
		} else if (player.g > 0 && player.currentJumps == player.maxJumps) player.currentJumps = player.maxJumps - 1;
		// anti-grav
		if (isTouching("any",6)) {
			if (player.g > 0) player.g = -player.g;
		}
		if (isTouching("any",7)) {
			if (player.g < 0) player.g = -player.g;
		}
		// grav magnitude
		if (isTouching("any",8)) player.g = Math.sign(player.g)*195;
		if (isTouching("any",9)) player.g = Math.sign(player.g)*350;
		if (isTouching("any",10)) player.g = Math.sign(player.g)*650;
		// multi-jump
		if (isTouching("any",12)) {
			player.maxJumps = 0;
			if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
		}
		if (isTouching("any",13)) {
			player.maxJumps = 1;
			if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
		}
		if (isTouching("any",14)) {
			player.maxJumps = 2;
			if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
		}
		if (isTouching("any",15)) {
			player.maxJumps = 3;
			if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
		}
		if (isTouching("any",16)) {
			player.maxJumps = Infinity;
			if (player.currentJumps != player.maxJumps && player.currentJumps != player.maxJumps-1) player.currentJumps = player.maxJumps-1;
		}
		// checkpoint
		if (isTouching("any",3)) {
			if (level[player.spawnPoint[0]] != undefined) {
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
			}
			let coord = getCoord(3);
			player.spawnPoint = [coord[0],coord[1],player.g,player.maxJumps];
			level[coord[0]][coord[1]] = 4;
			drawLevel();
		}
		if (isTouching("any",18)) {
			if (level[player.spawnPoint[0]] != undefined) {
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
			}
			let coord = getCoord(18);
			player.spawnPoint = [coord[0],coord[1],player.g,player.maxJumps];
			level[coord[0]][coord[1]] = 20;
			drawLevel();
		}
		if (isTouching("any",19)) {
			if (level[player.spawnPoint[0]] != undefined) {
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 4) level[player.spawnPoint[0]][player.spawnPoint[1]] = 3;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 17) level[player.spawnPoint[0]][player.spawnPoint[1]] = 19;
				if (level[player.spawnPoint[0]][player.spawnPoint[1]] == 20) level[player.spawnPoint[0]][player.spawnPoint[1]] = 18;
			}
			let coord = getCoord(19);
			player.spawnPoint = [coord[0],coord[1],player.g,player.maxJumps];
			level[coord[0]][coord[1]] = 17;
			drawLevel();
		}
		// death block
		if (isTouching("any",2) && !player.godMode) respawn();
		// key input
		if (control.left && player.xv > -200) {
			player.xv -= 200;
			if (player.xv < -200) player.xv = -200;
		}
		if (control.right && player.xv < 200) {
			player.xv += 200;
			if (player.xv > 200) player.xv = 200;
		}
		if (player.x < -1 || player.x > level.length*blockSize || player.y < -1 || player.y > level[0].length-*blockSize)
		// draw checks
		if (player.x != xprev || player.y != yprev) drawPlayer();
	}
	window.requestAnimationFrame(nextFrame);
}
function drawPlayer() {
	let canvas = document.getElementById("playerLayer");
	let pL = canvas.getContext("2d");
	canvas.width = level.length*blockSize;
	canvas.height = level[0].length*blockSize;
	pL.clearRect(0,0,canvas.width,canvas.height);
	pL.fillStyle = "#0000FF";
	if (player.godMode) pL.fillStyle = "#FFFF00";
	pL.fillRect(Math.floor(player.x), Math.floor(player.y), playerSize, playerSize);
	adjustScreen();
}
function drawLevel() {
	let canvas = document.getElementById("levelLayer");
	let lL = canvas.getContext("2d");
	canvas.width = level.length*blockSize;
	canvas.height = level[0].length*blockSize;
	drawPlayer();
	lL.clearRect(0,0,canvas.width,canvas.height);
	for (let x in level) {
		for (let y in level[x]) {
			lL.lineWidth = blockSize*3/25;
			let xb = x * blockSize;
			let yb = y * blockSize;
			let type = getBlockType(x,y);
			switch (type) {
				case 1:
					lL.fillStyle = "#000000";
					break;
				case 2:
					lL.fillStyle = "#FF0000";
					break;
				case 3:
					lL.fillStyle = "#00888888";
					break;
				case 4:
					lL.fillStyle = "#00FFFF88";
					break;
				case 5:
					lL.fillStyle = "#FFFF00";
					break;
				case 6:
					lL.fillStyle = "#FF888888";
					break;
				case 7:
					lL.fillStyle = "#8888FF88";
					break;
				case 8:
					lL.fillStyle = "#FFFF8888";
					break;
				case 9:
					lL.fillStyle = "#88FF8888";
					break;
				case 10:
					lL.fillStyle = "#88FFFF88";
					break;
				case 11:
					lL.fillStyle = "#7289DA";
					break;
				case 12:
					lL.fillStyle = "#77440088";
					break;
				case 13:
					lL.fillStyle = "#99550088";
					break;
				case 14:
					lL.fillStyle = "#BB660088";
					break;
				case 15:
					lL.fillStyle = "#DD770088";
					break;
				case 16:
					lL.fillStyle = "#FF880088";
					break;
				case 17:
					lL.fillStyle = "#FFFF0088";
					break;
				case 18:
					lL.fillStyle = "#88880088";
					break;
				case 19:
					lL.fillStyle = "#88880088";
					break;
				case 20:
					lL.fillStyle = "#FFFF0088";
					break;
				default:
					lL.fillStyle = "#00000000";
			}
			lL.fillRect(xb, yb, blockSize, blockSize);
			switch (type) {
				case 2:
					lL.strokeStyle = "#880000";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 3:
					lL.strokeStyle = "#00444488";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 4:
					lL.strokeStyle = "#00888888";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 5:
					lL.strokeStyle = "#888800";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/4);
					lL.stroke();
					break;
				case 6:
					lL.strokeStyle = "#88000088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/5-blockSize/25*6);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2-blockSize/25*3,yb+blockSize/25*6);
					lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2+blockSize/25*3,yb+blockSize/25*6);
					lL.stroke();
					break;
				case 7:
					lL.strokeStyle = "#00008888";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize/25*3,blockSize/5,blockSize/5);
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/5+blockSize/25*6);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2-blockSize/25*3,yb+blockSize-blockSize/25*6);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/2+blockSize/25*3,yb+blockSize-blockSize/25*6);
					lL.stroke();
					break;
				case 8:
					lL.strokeStyle = "#88880088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*9);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 9:
					lL.strokeStyle = "#00880088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/4);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 10:
					lL.strokeStyle = "#00888888";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);
					
					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/25*3);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
				case 11:
					lL.strokeStyle = "#4E5D94";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/2);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize/2);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/4,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/25*3,yb+blockSize/4);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize-blockSize/4,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
					lL.stroke();
					break;
				case 12:
					lL.strokeStyle = "#44220088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 13:
					lL.strokeStyle = "#55270088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/3*2,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/3*2,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 14:
					lL.strokeStyle = "#66330088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					for (let i = 1; i < 3; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/3*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/3*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/6,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize/6*5,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/6,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize/6*5,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 15:
					lL.strokeStyle = "#77380088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					for (let i = 1; i < 4; i++) {
						lL.beginPath();
						lL.moveTo(xb+blockSize/4*i,yb+blockSize/25*3);
						lL.lineTo(xb+blockSize/4*i,yb+blockSize-blockSize/25*3);
						lL.stroke();
					}
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					break;
				case 16:
					lL.strokeStyle = "#88440088";
					lL.lineWidth = blockSize/25;
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.quadraticCurveTo(xb+blockSize/2,yb-blockSize/2,xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();
					
					lL.beginPath();
					lL.moveTo(xb+blockSize/2,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize/25*3,yb+blockSize/25*3,xb+blockSize/25*3,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3,xb+blockSize/2,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3,xb+blockSize-blockSize/25*3,yb+blockSize/2);
					lL.quadraticCurveTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3,xb+blockSize-blockSize/2,yb+blockSize/2);
					lL.stroke();
					break;
				case 17:
					lL.strokeStyle = "#88880088";
					lL.beginPath();
					lL.arc(xb+blockSize/2,yb+blockSize/2,blockSize/2-blockSize/25*3,0,2*Math.PI);
					lL.stroke();
					break;
				case 18:
					lL.strokeStyle = "#44440088";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 19:
					lL.strokeStyle = "#44440088";
					lL.beginPath();
					lL.arc(xb+blockSize/2,yb+blockSize/2,blockSize/2-blockSize/25*3,0,2*Math.PI);
					lL.stroke();
					break;
				case 20:
					lL.strokeStyle = "#88880088";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
			}
		}
	}
	adjustScreen();
}
function adjustScreen() {
	let lvlx = Math.floor((window.innerWidth - level.length*blockSize) / 2);
	if (lvlx < 0) {
		lvlx = Math.floor(window.innerWidth/2) - Math.floor(player.x+playerSize/2);
		if (lvlx > 0) lvlx = 0;
		if (lvlx < window.innerWidth - level.length*blockSize) lvlx = Math.floor(window.innerWidth - level.length*blockSize);
	}
	let lvly = Math.floor((window.innerHeight - level[0].length*blockSize) / 2);
	if (lvly < 0) {
		lvly = Math.floor(window.innerHeight/2) - Math.floor(player.y+playerSize/2);
		if (lvly > 0) lvly = 0;
		if (lvly < window.innerHeight - level[0].length*blockSize) lvly = Math.floor(window.innerHeight - level[0].length*blockSize);
	}
	id("playerLayer").style.left = lvlx+"px";
	id("levelLayer").style.left = lvlx+"px";
	id("playerLayer").style.top = lvly+"px";
	id("levelLayer").style.top = lvly+"px";
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
toStart();
drawLevel();
window.requestAnimationFrame(nextFrame);
