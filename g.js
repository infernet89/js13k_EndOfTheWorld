var kongregate;
var canvasWidth = 500;
var canvasHeight = 900;

var baseHeight = 337;
var TO_RADIANS = Math.PI/180; 

//menu
var titleY=200;
var titleDown=false;
var martelloMenu;
var taskmenu;
var inMenu=true;

// immagini
var base;
var sfondo;
var birdAnimation;
var noitaminAdrib;
var bird;
var birdDead;
var tutorial;
var barra;
var martello;
var gameOverText;
var gameOverPanel;

// audio
var start;
var jump;
var copter;
var levelup;

// ostacoli
var obstacleArray;
var minBarWidth = 50;
var maxBarWidth = 200;
var avanzamento = 4;

var tutorialX=-200;
var animaTutorial=false;
var accelerazione = 0;
var birdX = 217;
var birdY = 0;
var baseOffset;
var bgOffset = 0;
var task;
var initialized = false;
var started = false;
var gameOver = false;
var stato = 1; // 1, 2, 3, lo stato dell'elica
var direction = 0; // 0 sinistra, 1 destra
var generation = 0;
var random;
var score = 0;
var bestScore = 0;
var falling=false;
var randomBgColor="#3cbbe8";

function setupMenu() {
	gameCanvas = document.getElementById("gameCanvas");
	ctx = gameCanvas.getContext("2d");
	bgColor=randomBgColor;
	ctx.fillStyle = bgColor;
	sfondo = new Image();
	sfondo.src = "pic/sfondo.png";
	base = new Image();
	base.src = "pic/base.png";
	playbutton = new Image();
	playbutton.src = "pic/playbutton.png";
	scorebutton = new Image();
	scorebutton.src = "pic/scorebutton.png";
	title = new Image();
	title.src = "pic/title.png";
	barra = new Image();
	barra.src = "pic/barra.png";
	martello = new Image();
	martello.src = "pic/martello.png";
	gameOverText = new Image();
	gameOverText.src = "pic/gameOver.png";
	gameOverPanel = new Image();
	gameOverPanel.src = "pic/gameOverBox.png";
	birdDead = new Image();
	birdDead.src = "pic/birdDead.png";

	start = new Audio("audio/start.mp3");
	copter = new Audio("audio/copter.mp3");
	levelup = new Audio("audio/levelup.mp3");
	jump = new Audio("audio/jump.mp3");
	lost = new Audio("audio/lost.mp3");
	tonfo = new Audio("audio/tonfo.mp3");

	ctx.drawImage(sfondo, 0, 0, canvasWidth, canvasHeight);
	gameCanvas.addEventListener("mousedown", doMouseDown, false);
	taskmenu=setInterval(drawMenu, 25);
	
	martelloMenu=martelloObj(125);
	martelloMenu.barray=290;

}

function drawMenu()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	//disegno lo sfondo
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.drawImage(sfondo, 0, 0, canvasWidth, canvasHeight);

	//disegno la base
	ctx.drawImage(base, 0, canvasHeight-base.height, base.width, base.height);

	//disegno i martelli
	martelloMenu.draw(ctx);
	martelloMenu.anima();

	//disegno i bottoni
	ctx.drawImage(playbutton, 50, 635, playbutton.width, playbutton.height);
	ctx.drawImage(scorebutton, 290, 635, scorebutton.width, scorebutton.height);

	//disegno il title
	ctx.drawImage(title,140,titleY,title.width,title.height);
	if(titleDown) titleY+=1.5;
	else titleY-=1.5;
	if(titleY>=210) titleDown=false;
	if(titleY<=190) titleDown=true;

}
function startGame() {
	r=Math.floor((Math.random() * 5) + 1);
	if(r==1) randomBgColor="#bca385";
	if(r==2) randomBgColor="#8580bd";
	if(r==3) randomBgColor="#3cbbe8";
	if(r==4) randomBgColor="#3cbbe8";
	if(r==5) randomBgColor="#3cbbe8";

	start.play();
	points = 0;
	inMenu=false;
	clearInterval(taskmenu);
	setupGame();
}
function setupGame() {
	if(!initialized) {
		initialized = true;
		gameCanvas = document.getElementById("gameCanvas");
		ctx = gameCanvas.getContext("2d");

		// caricamento immagini
		base = new Image();
		base.src = "pic/base.png";
		sfondo = new Image();
		sfondo.src = "pic/sfondo.png"
		birdAnimation = new Image();
		birdAnimation.src = "pic/birdspritesheet.png";
		noitaminAdrib = new Image();
		noitaminAdrib.src = "pic/birdspritesheetMirror.png";
		tutorial = new Image();
		tutorial.src = "pic/tutorial.png";
		barra = new Image();
		barra.src = "pic/barra.png";
		martello = new Image();
		martello.src = "pic/martello.png";

		obstacleArray = new Array();
	}

	birdX = 217;
	accelerazione = 0;
	score = 0;
	while(obstacleArray.length != 0) {
		obstacleArray[0].barray = 910;
		obstacleArray[0].draw();
		obstacleArray.shift();
	}
		
	obstacleArray.push(new martelloObj(125));
	obstacleArray[0].barray = 290;

	baseOffset = 900 - baseHeight;
	task = setInterval(draw, 25);
}
function draw() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// disegna lo sfondo
	ctx.fillStyle = randomBgColor;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.drawImage(sfondo, 0, bgOffset, canvasWidth, canvasHeight);
	ctx.drawImage(sfondo, 0, -canvasHeight+bgOffset, canvasWidth, canvasHeight);
	if (bgOffset > 900) {
		bgOffset = 0;
	};

	if (baseOffset < 900 && !gameOver) {
		// la base va ancora disegnata
		ctx.drawImage(base, 0, baseOffset);
		if (started) {
			baseOffset = baseOffset + avanzamento;
		};
	}

	if (!gameOver) {
		if (started) {
			// il gioco è iniziato
			bgOffset = bgOffset + avanzamento;
			if (direction == 0) {
				// vai a sinistra
				accelerazione--;
				birdX = birdX + accelerazione; //Math.floor(accelerazione/2);
			} else {
				// vai a destra
				accelerazione++;
				birdX = birdX + accelerazione; //Math.floor(accelerazione/2);
			}
			if (birdX < 0 || birdX > 425) {
				accelerazione = 0;
				if (birdX < 0) {
					birdX = 0;
				} else {
					birdX = 425;
				}
				GameOver();
			};
			stato++;
			if (stato > 3) {
				stato = 1;
			};
			drawBird(birdX, birdY, stato);
			handleObstacles();
			copter.play();

			// disegna il punteggio
			ctx.font = "40px Pixellated";
			ctx.fillStyle = "#000000";
			ctx.fillText(score, 228, 122);
		} else {
			// disegna il tutorial e resta fermo
			if(tutorialX<195) tutorialX+=15;
			ctx.drawImage(tutorial, tutorialX, 332);
			if(animaTutorial)
			{
				tutorialX+=15;
				if(tutorialX>500) {
					started=true;
				}
			}
			birdY = 572;
			obstacleArray[0].anima();
			obstacleArray[0].draw(ctx);
			drawBird(birdX, birdY, 1);
		}
	} else {
		// Game Over
		generation = 0;
		ctx.fillStyle = randomBgColor;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.drawImage(sfondo, 0, bgOffset, canvasWidth, canvasHeight);
		ctx.drawImage(sfondo, 0, -canvasHeight+bgOffset, canvasWidth, canvasHeight);
		if (obstacleArray.length > 0) {
			accelerazione++;
			bgOffset = bgOffset - accelerazione;
			if (bgOffset < 0) {
				bgOffset = 900;
			};
			for (var i = 0; i < obstacleArray.length; i++) {
				obstacleArray[i].barray = obstacleArray[i].barray - accelerazione;
				obstacleArray[i].anima();
				obstacleArray[i].draw(ctx);
				if (obstacleArray[i].barray < -140) {
					obstacleArray.splice(i, 1);
				};
			};
		} else {
			if (baseOffset > 900 - baseHeight) {
				accelerazione++;
				baseOffset = baseOffset - accelerazione;
				if (baseOffset < 900 - baseHeight) {
					baseOffset = 900 - baseHeight;
				};
			} else {
				baseOffset = 900 - baseHeight;
				if(falling)
				{
					progressGameover=1500;
					tonfo.play();
				}
				falling=false;
			}
			ctx.drawImage(base, 0, baseOffset);
		}
		ctx.save();
		ctx.translate(birdX,birdY);
		if(falling) ctx.rotate((8*accelerazione)*TO_RADIANS);
		else
		{
			ctx.translate(0,75);
			ctx.rotate(180*TO_RADIANS);
		}
		ctx.drawImage(birdDead, -birdDead.width/2, -birdDead.height/2);
		ctx.restore();

		if(falling) return;
		if(progressGameover>0) progressGameover-=50;
		copter = new Audio("audio/copter.mp3");
		accelerazione=0;
		ctx.drawImage(gameOverText, 104, 100-progressGameover, 291, 58);
		ctx.drawImage(gameOverPanel, 44, 370+progressGameover, 411, 244);
		ctx.font = "30px Pixellated";
		ctx.fillStyle = "#000000";
		ctx.fillText(score, 366+progressGameover, 477);
		ctx.fillText(bestScore, 366+progressGameover, 552);
		ctx.drawImage(playbutton, 50-progressGameover, 635, playbutton.width, playbutton.height);
		ctx.drawImage(scorebutton, 290+progressGameover, 635, scorebutton.width, scorebutton.height);
	}
	
	//mostra le hitboxes
	/*if (obstacleArray.length <= 0) return;
	ctx.fillStyle = "#FF0000";
	var i,k;
	for(i=0;i<500;i++)
		for(k=0;k<900;k++)
			if(obstacleArray[0].checkCollision(i,k)) ctx.fillRect(i, k, 1, 1);
	obstacleArray[0].draw(ctx);*/

}

function GameOver() {
	accelerazione = 0;
	baseOffset = 900;
	gameOver = true;
	if (score > bestScore) 
		bestScore = score;
	//kongregate.stats.submit("score",score);
	//alert(cacca);
	//copter.currentTime = 0;
	//copter.pause();
	copter.src = ""; // vorrei tanto sapere perchè pause non basta
	falling=true;
	lost.play();
}

function drawBird(x, y, pic) {
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(accelerazione*TO_RADIANS);
	if(accelerazione<0)
	{
		if (pic == 1) {
		ctx.drawImage(noitaminAdrib, 0, 0, 75, 76, 0, 0, 75, 76);
		} else {
			if (pic == 2) {
				ctx.drawImage(noitaminAdrib, 75, 0, 75, 76, 0, 0, 75, 76);
			} else {
				if (pic == 3) {
					ctx.drawImage(noitaminAdrib, 150, 0, 75, 76, 0, 0, 75, 76);
				};
			}
		}
	} 
	else
	{
		if (pic == 1) {
		ctx.drawImage(birdAnimation, 0, 0, 75, 76, 0, 0, 75, 76);
		} else {
			if (pic == 2) {
				ctx.drawImage(birdAnimation, 75, 0, 75, 76, 0, 0, 75, 76);
			} else {
				if (pic == 3) {
					ctx.drawImage(birdAnimation, 150, 0, 75, 76, 0, 0, 75, 76);
				};
			}
		}
	}
	ctx.restore();
}

function doMouseDown(event) {
	if(falling) return;
	var rect = gameCanvas.getBoundingClientRect();
	mousex=(event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width,
	mousey=(event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height
	if(inMenu)
	{
		if(mousex>50 && mousex<50+playbutton.width && mousey>635 && mousey<635+playbutton.height)
		{
			startGame();
		}
		return;
	}
	if (gameOver) {
		if (mousex>50 && mousex<50+playbutton.width && mousey>635 && mousey<635+playbutton.height) 
		{
			gameOver = false;
			clearInterval(task);
			startGame();
		}
	}
	if (!animaTutorial) {
		animaTutorial = true;
	};
	if (direction == 0) {
		jump.play();
		direction = 1;
	} else {
		direction = 0;
		jump.play();
	}
}

function handleObstacles() {
	if (generation > 0) {
		generation--;
	} else {
		generation = 100;
		random = Math.random() * (maxBarWidth - minBarWidth) + minBarWidth;
		
		obstacleArray.push(new martelloObj(random));
	}
	if (obstacleArray.length > 0 && obstacleArray[0].barray > canvasHeight) {
		obstacleArray.shift();
	};
	document.bgColor="#FFFFFF";
	for (var i = 0; i < obstacleArray.length; i++) {
		obstacleArray[i].barray = obstacleArray[i].barray + avanzamento;
		obstacleArray[i].anima();
		obstacleArray[i].draw(ctx);
		if(obstacleArray[i].checkCollision(birdX, birdY)) { 
			// Game Over
			//document.bgColor="#FF0000";
			GameOver();
		}
		if ((obstacleArray[i].barray > birdY+35) && (!obstacleArray[i].passed)) {
			obstacleArray[i].passed = true;
			levelup.play();
			score++;
			//console.log("punto");
		};
	};
}

function martelloObj(offsetX) {
	var that = {};
	that.passed = false;
	that.offsetX = offsetX;
	that.barrax=-370+offsetX;
	that.barray=-140;
	that.angoloMartello=0;
	that.angoloPlus=true;
	that.anima = function () {
		if(that.angoloPlus) that.angoloMartello+=1.5;
		else that.angoloMartello-=1.5;
		if(that.angoloMartello>=25) that.angoloPlus=false;
		if(that.angoloMartello<=-25) that.angoloPlus=true;
	}
	//passare il contesto del canvas
	that.draw = function (ctx) {
		ctx.drawImage(barra, that.barrax, that.barray, barra.width, barra.height);
		ctx.save();
		ctx.translate(that.barrax+340,that.barray+40);
		ctx.rotate(that.angoloMartello*TO_RADIANS);
		ctx.drawImage(martello, -33, 0, martello.width, martello.height);
		ctx.restore();
		ctx.save();
		ctx.translate(that.barrax+340+285,that.barray+40);
		ctx.rotate(that.angoloMartello*TO_RADIANS);
		ctx.drawImage(martello, -33, 0, martello.width, martello.height);
		ctx.restore();
	}
	//passare l'oggetto con cui testare (75x76)
	that.checkCollision = function (testx,testy) {
		if((testx<370+that.barrax || testx>550+that.barrax) && (testy+55>that.barray && testy<that.barray+40)) return true;
		if(testy>that.barray+150) return false;
		if(testy+100<that.barray+150) return false;
		//non è nella stessa y del martello
		//mateMagica
		progressMartello=that.barrax+90+60*((that.angoloMartello+25)/-50);
		if(testx<215+progressMartello) return false;
		if(testx>600+progressMartello) return false;
		if(testx>310+progressMartello && testx<480+progressMartello) return false;
		return true;
	}
	return that;
}

function sprite (options) {
	var that = {};
	that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    that.render = function () {
    	that.context.drawImage(that.image,
					           0,
					           0,
					           that.width,
					           that.height,
					           0,
					           0,
					           that.width,
					           that.height);
    }

    return that;
}