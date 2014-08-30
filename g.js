//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var ctx;
var canvasW=800;
var canvasH=600;
var activeTask;
var level=0;//0 menu
var pg;
var Kpressed=[];
var string;
var offsetY=0;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
pg=new Object();
pg.px=660;
pg.py=100;
pg.dx=0;
pg.dy=0;
pg.ax=0;
pg.ay=0;

window.addEventListener('keydown',keyDown,false);
window.addEventListener('keyup',keyUp,false);
activeTask=setInterval(run, 33);

//levelUp();//DEBUG!

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0, canvasW, canvasH);
    if(level==0)
    {
    	//titolo
    	ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
    	ctx.fillText("The END of the WORL",50,100);
    	//alert(ctx.measureText("The END of the WORL").width);
    	drawPg();
    	ctx.fillStyle="#FFFFFF";
    	ctx.font = "20px Arial";
    	if(Kpressed[68])
    	{
    		pg.ay=0.5;
    		pg.ax=-0.3;
    	}
    	if(pg.ay==0) ctx.fillText("press D to start",300,400);
    	if(pg.py>canvasH) levelUp();
    }
    else if(level==1)
    {//vertical falling
    	//muri
    	ctx.fillStyle="#7B7B7B";
    	ctx.font = "30px Courier";
    	string="WALL";	//25px
    	for(i=0;i<=(canvasH/25)+string.length;i++)
    	{
    		ctx.fillText(string[i%string.length],2,i*25-offsetY);
    		ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-offsetY);
    	}
    	if((offsetY+=8)>=string.length*25) offsetY=0;

    	//sbatte contro i muri
    	if(pg.px<15 && pg.dx<0) pg.dx=-pg.dx*0.6;
    	if(pg.px>canvasW-55 && pg.dx>0) pg.dx=-pg.dx*0.6;

    	drawFire(100,500);

    	//spostamento
    	if(Kpressed[68]) pg.ax=0.8;
    	else pg.ax=-0.8;
    	//gravità
    	if(pg.py<150) pg.dy=2;
    	else pg.dy=0;

    	drawPg();
    }
}
function levelUp()
{
	level++;
	if(level==1)
	{
		pg.px=400;
		pg.py=0;
		pg.ay=0;
		pg.ax=0;
		pg.dx=0;
		pg.dy=0;
	}
}
function drawFire(x,y)
{
	ctx.font = "50px Courier";
	string="FIRE";
	for(i=0;i<4;i++)
	{
		r=rand(0,4);
		if(r==0) ctx.fillStyle="#ff0000";
		else if(r==1) ctx.fillStyle="#ffcc00";
		else if(r==2) ctx.fillStyle="#ff4400";
		else if(r==3) ctx.fillStyle="#ff8800";
		else ctx.fillStyle="#ffaa00";
		ctx.fillText(string[i],x+i*25,y);
	}
}
function drawPg()
{
	if(level<=1)
	{
		if(Kpressed[68]) ctx.fillStyle="#FF0000";
		else ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
    	ctx.save();
    	ctx.translate(pg.px+20,pg.py-25);
    	ctx.rotate(pg.dx*TO_RADIANS);
    	ctx.translate(-20,25);
    	ctx.fillText("D",0,0);
    	ctx.restore();
	}

	//lo muovo
	pg.px+=pg.dx;
	pg.py+=pg.dy;
	pg.dx+=pg.ax;
	pg.dy+=pg.ay;
}
function keyDown(e) {
	Kpressed[e.keyCode]=true;
	//alert(e.keyCode);
}
function keyUp(e) {
	Kpressed[e.keyCode]=false;
}
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}