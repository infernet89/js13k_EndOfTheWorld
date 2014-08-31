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
var ostacoli=[];
var progressLevel;

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

levelUp();levelUp();levelUp();//DEBUG!

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
    	if((offsetY+=8)>=string.length*25) offsetY-=string.length*25;

    	//ostacoli
        //ctx.fillRect(pg.px,pg.py,pg.width,pg.height);
        for(i=0;i<ostacoli.length;i++)
        {
            //ctx.fillRect(ostacoli[i].px,ostacoli[i].py,ostacoli[i].width,ostacoli[i].height);
            ostacoli[i].draw();
            if(pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height && pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width)
                gameover();
        }

        //sbatte contro i muri
    	if(pg.px<15 && pg.dx<0) pg.dx=-pg.dx*0.6;
    	if(pg.px>canvasW-55 && pg.dx>0) pg.dx=-pg.dx*0.6;

        //spostamento
    	if(Kpressed[68]) pg.ax=0.8;
    	else pg.ax=-0.8;
    	//gravità
    	if(pg.py<100) pg.dy=2;
    	else pg.dy=0;

    	drawPg();
        progressLevel++;
        if(progressLevel>=1000) levelUp();
    }
    else if(level==2)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25);
        }

        drawPg();

        //la L
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("L",303,445);

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            for(i=0;i<(canvasW/15);i++)
                ctx.fillText(string[(i+k*3)%string.length],15*i,450+k*18);
        }
        ctx.fillRect(0,430,canvasW,170);
        ctx.restore();

        if(Math.abs(pg.py-400)<1 && Math.abs(pg.dy)<2)
        {
            pg.ay=0;
            pg.dy=0;
            levelUp();
            return;
        }
        if(pg.py>400)
        {
            if(pg.dy>2) pg.dy=pg.dy-2;
            pg.ay=-0.2;
            pg.ax=0;
            pg.dx=0;
        }
        else if(pg.ax==0 && pg.py<400) pg.ay=0.5;
        //else if(pg.py<440) pg.ay=-0.2;
        //else pg.ay=0;
        //progressLevel++;

    }
    else if(level==3)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25);
        }

        //movimenti
        if(Kpressed[76]) pg.ax=-0.2;
        else if(Kpressed[68]) pg.ax=0.2;
        else pg.ax=0;
        //sbatte contro i muri
        if(pg.px<15 && pg.dx<0) pg.dx=-pg.dx*0.6;
        if(pg.px>canvasW-90 && pg.dx>0) pg.dx=-pg.dx*0.6;

        drawPg();

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            for(i=0;i<(canvasW/15);i++)
                ctx.fillText(string[(i+k*3)%string.length],15*i,450+k*18);
        }
        ctx.fillRect(0,430,canvasW,170);
        ctx.restore();
    }
}
function gameover()
{
    return;
    level--;
    levelUp();
}
function levelUp()
{
    progressLevel=0;
	level++;
	if(level==1)
	{
		pg.px=400;
		pg.py=-90;
		pg.ax=0;
        pg.ay=0;
		pg.dx=10;
		pg.dy=0;
        pg.width=40;
        pg.height=45;
        offsetY=0;
        progressLevel=0;
        while(ostacoli.length>0) ostacoli.pop();
        //rocce da 100 a 1000
        quanti=rand(3,15);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=15;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        quanti=rand(2,10);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=canvasW-80;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        //il fuoco, più lento
        quanti=rand(10,30);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(1);
            t.px=rand(75,canvasW-180);
            t.dy=rand(-3,-6);
            t.py=rand(-t.dy*100+300,-t.dy*1000);
            ostacoli.push(t);
        }

	}
    else if(level==2)
    {
        while(ostacoli.length>0) ostacoli.pop();
        pg.py=-190;
        pg.px=400;
        pg.dy=8;
        pg.dx=0;
        pg.ax=-0.1;
        pg.ay=0.5;
    }
    else if(level==3)
    {
        pg.px=303;
        pg.py=400;
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
    }

}
function drawFire(x,y)
{
    ctx.save();
    ctx.translate(0,30);
	ctx.font = "50px Courier";
	string="FIRE";
	for(fi=0;fi<4;fi++)
	{
		r=rand(0,4);
		if(r==0) ctx.fillStyle="#ff0000";
		else if(r==1) ctx.fillStyle="#ffcc00";
		else if(r==2) ctx.fillStyle="#ff4400";
		else if(r==3) ctx.fillStyle="#ff8800";
		else ctx.fillStyle="#ffaa00";
		ctx.fillText(string[fi],x+fi*25,y);
	}
    ctx.restore();
}
function drawRock(x,y)
{
    ctx.save();
    ctx.translate(0,38);
    ctx.font = "60px Courier";
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("R",x,y);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("O",x+28,y);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("C",x,y+35);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("K",x+28,y+35);
    ctx.restore();
}
function drawPg()
{
    ctx.save();
    ctx.translate(0,45);
	if(level<=2)
	{
		if(Kpressed[68]) ctx.fillStyle="#FF0000";
		else ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
    	ctx.translate(pg.px+20,pg.py-25);
    	ctx.rotate(pg.dx*TO_RADIANS);
    	ctx.translate(-20,25);
    	ctx.fillText("D",0,0);
	}
    else if(level==3)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",0,0);
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",34,0);
    }
    ctx.restore();

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

function ostacoloObj(tipo) {
  //1=fire, 2=rock  
  this.tipo=tipo;
  this.px=0;
  this.py=0;
  this.dx=0;
  this.dy=0;
  this.ax=0;
  this.ay=0;
  if(tipo==1)
  {
    this.width=100;
    this.height=30;
  }
  else if(tipo==2)
  {
    this.width=60;
    this.height=75;
  }
  this.draw = function () {
    if(this.tipo==1) drawFire(this.px,this.py);
    else if(this.tipo==2) drawRock(this.px,this.py);
    this.px+=this.dx;
    this.py+=this.dy;
    this.dx+=this.ax;
    this.dy+=this.ay;
  }
}