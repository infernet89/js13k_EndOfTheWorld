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
var progressLevel=0;
var shooting;
var bullet;
var aliens=[];
var offsetWon=0;
var stars=[];
var particles=[];
var lightningDelay=100;
var nGameOvers=0;
var shootingStardelay;
var useKeyboard=false;
var soundenabled=true;

//mobile controls
var mousex=-100;
var mousey=-100;
var mouse2x=-100;
var mouse2y=-100;
var mouse3x=-100;
var mouse3y=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
pg=new Object();
pg.px=660;
pg.py=55;
pg.dx=0;
pg.dy=0;
pg.ax=0;
pg.ay=0;

if (window.navigator.pointerEnabled) {
    canvas.addEventListener("pointermove", mossoMouse, false);
    canvas.addEventListener("pointerup", rilasciatoTap, false);
}
else
{
    canvas.addEventListener("touchmove", mossoTap);
    canvas.addEventListener("touchstart", cliccatoTap);
    canvas.addEventListener("touchend", rilasciatoTap);
}

//i suoni
var tonfo = new Audio("sound/tonfo.mp3");
var fire = new Audio("sound/fire.mp3");
var thunder = new Audio("sound/thunder.mp3");
var splash = new Audio("sound/splash.mp3");
var splash1 = new Audio("sound/splash1.mp3");
var splash2 = new Audio("sound/splash2.mp3");
var prosciuga = new Audio("sound/prosciuga.mp3");
var explode = new Audio("sound/explode.mp3");
var shoot = new Audio("sound/shoot.mp3");
var earthquake = new Audio("sound/earthquake.mp3");
var alienmovedown = new Audio("sound/alienmovedown.mp3");
var spawnaliens = new Audio("sound/spawnaliens.mp3");
var bgmusic = new Audio("sound/calmassoluta.mp3");
    bgmusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    bgmusic.addEventListener('timeupdate', function(){
                var buffer = .44
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }}, false);



window.addEventListener('keydown',keyDown,false);
window.addEventListener('keyup',keyUp,false);
activeTask=setInterval(run, 33);

//levelUp();levelUp();levelUp();levelUp();levelUp();levelUp();levelUp();//DEBUG!
function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    var grd=ctx.createLinearGradient(0,0,0,canvasH);
    grd.addColorStop(0,"#000000");
    grd.addColorStop(1,"#101010");

    ctx.fillStyle=grd;
    ctx.fillRect(0,0, canvasW, canvasH);

    if(level==0)
    {
        drawLightning();
        playStars();
    	//titolo
    	ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
        if(offsetWon>0) ctx.fillText(" The END of the WOR",50,100);
    	else ctx.fillText("The END of the WORL",50,100);
    	//alert(ctx.measureText("The END of the WORL").width);
    	drawPg();
    	ctx.fillStyle="#FFFFFF";
    	ctx.font = "20px Arial";
    	if(Kpressed[68])
    	{
            if(soundenabled) bgmusic.play();
    		pg.ay=0.5;
    		pg.ax=-0.3;
    	}
    	if(progressLevel%40<30) if(pg.ay==0) ctx.fillText("press D to start",300,400);
        ctx.font = "10px Arial";
        ctx.fillText("Made for JS13KGames competition",620,590);
        progressLevel++;
    	if(pg.py>canvasH) levelUp();
    }
    else if(level==1)
    {//vertical falling
        drawLightning();
        if(progressLevel<1000) drawRain();
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
    	if(pg.px<15 && pg.dx<0)
            {
                if(soundenabled) tonfo.play();
                pg.dx=-pg.dx*0.6;
                hurtParticle(pg.px,pg.py+pg.height/2,"#00FF00");
            }
    	if(pg.px>canvasW-55 && pg.dx>0)
        {
            if(soundenabled) tonfo.play();
            pg.dx=-pg.dx*0.6;
            hurtParticle(pg.px+pg.width,pg.py+pg.height/2,"#00FF00");
        }

        //spostamento
    	if(Kpressed[68]) pg.ax=0.8;
    	else pg.ax=-0.8;
    	//gravità
    	if(pg.py<100) pg.dy=2;
    	else pg.dy=0;
        if(progressLevel>=1000) pg.dy=4;
    	drawPg();
        progressLevel++;
        if(progressLevel>=1130) levelUp();
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
            acqua=(string+string+string+string+string+string+string+string+string+string+string+string).substring(k);
            ctx.fillText(acqua,0,450+k*18);
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
            if(pg.py>400 && pg.py<420 && pg.dy>0)
            {
                if(pg.py>410 && soundenabled) splash2.play();
                else if(soundenabled) splash.play();
            }
            pg.ay=-0.2;
            pg.ax=0;
            pg.dx=0;
            hurtParticle(pg.px+pg.width/2,pg.py+pg.height,"#007eff");
        }
        else if(pg.ax==0 && pg.py<400) pg.ay=0.5;
        //else if(pg.py<440) pg.ay=-0.2;
        //else pg.ay=0;
        //progressLevel++;
    }
    else if(level==3)
    {
        ctx.save();
        if(++progressLevel<30)
        {
            ctx.translate(rand(-1,2),rand(-2,2));
            if(soundenabled) earthquake.play();
        }
        if(ostacoli.length>2) drawCalcinacci();
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
        if(pg.px<15 && pg.dx<0)
        {
            if(soundenabled) tonfo.play();
            pg.dx=-pg.dx*0.6;
            hurtParticle(pg.px,pg.py+pg.height/2,"#00FF00");
        }
        if(pg.px>canvasW-90 && pg.dx>0)
        {
            if(soundenabled) tonfo.play();
            pg.dx=-pg.dx*0.6;
            hurtParticle(pg.px+pg.width,pg.py+pg.height/2,"#00FF00");
        }

        drawPg();

        //caduta rocce
        for(i=0;i<ostacoli.length;i++)
        {
            ostacoli[i].draw();
            if(pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height && pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width)
            {
                if(ostacoli[i].dy!=2)
                {
                    gameover();
                    return;
                }
                else if(ostacoli[i].dy==2 && pg.dx>0 && pg.px<ostacoli[i].px) pg.dx=0;
                else if(ostacoli[i].dy==2 && pg.dx<0 && pg.px>ostacoli[i].px) pg.dx=0;
                if(soundenabled) tonfo.play();
            }
            if(ostacoli[i].py>370 && ostacoli[i].dy!=2)
            {
                if(splash.paused && soundenabled) splash.play();
                else if(splash1.paused && soundenabled) splash1.play();
                else if(splash2.paused && soundenabled) splash2.play();
                ostacoli[i].dy=2;
                hurtParticle(ostacoli[i].px+ostacoli[i].width/2,ostacoli[i].py+ostacoli[i].height,"#007eff");
            }
            if(ostacoli[i].py>620) ostacoli.splice(i,1);
        }

        //acqua
        ctx.restore();
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            acqua=(string+string+string+string+string+string+string+string+string+string+string+string).substring(k);
            ctx.fillText(acqua,0,450+k*18);
        }
        ctx.fillRect(0,430,canvasW,170);
        ctx.restore();

        if(ostacoli.length<=0) levelUp();
    }
    else if(level==4)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25+progressLevel-200);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25+progressLevel-200);
        }

        drawPg();
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        if(progressLevel<155) ctx.fillText("R",pg.px-42,canvasH+156-155/2-progressLevel/2);
        else ctx.fillText("R",pg.px-42,canvasH-1);

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            acqua=(string+string+string+string+string+string+string+string+string+string+string+string).substring(k);
            ctx.fillText(acqua,0,450+k*18+progressLevel);
        }
        ctx.fillRect(0,430+progressLevel,canvasW,170);
        ctx.restore();

        if(progressLevel>170)
        {
            levelUp();
            return;
        }
        if(progressLevel<2 && soundenabled) prosciuga.play();
        progressLevel+=2;
        if(progressLevel<155) pg.py+=2;
    }
    else if(level==5)
    {
        if(progressLevel++==0 && soundenabled) spawnaliens.play();
        drawLightning();
        drawShootingstar();
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="ALLW";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25-200);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-200);
        }

        //movimento
        if(Kpressed[82]) pg.ax=-0.5;
        else if(Kpressed[68]) pg.ax=0.5;
        else
        {
            pg.ax=0;
            pg.dx=pg.dx/1.1;
        }
        //speed limit
        if(Math.abs(pg.dx)>5) pg.dx=5*pg.dx/Math.abs(pg.dx);
        //sbatte contro i muri
        if(pg.px<15 && pg.dx<0)
        {
            pg.dx=-pg.dx*0.6;
            if(soundenabled) tonfo.play();
        }
        if(pg.px>canvasW-132 && pg.dx>0)
        {
            pg.dx=-pg.dx*0.6;
            if(soundenabled) tonfo.play();
        }

        //i nemici, ALIENI
        ctx.fillStyle="#FFFFFF";
        ctx.font = "55px Courier";
        aliens.px=999;
        aliens.width=-999;
        for(i=0;i<aliens.length;i++)
        {
            ctx.fillText(aliens[i].txt,aliens[i].px,aliens[i].py);
            aliens[i].px+=aliens.dx;
            //collisioni
            if(bullet.py+5>aliens[i].py-35 && bullet.py<aliens[i].py+aliens[i].height-35 && bullet.px+3>aliens[i].px && bullet.px<aliens[i].px+aliens[i].width)
            {
                hurtParticle(aliens[i].px+aliens[i].width/2,aliens[i].py-aliens[i].height/2,"FFFFFF");
                hurtParticle(aliens[i].px+aliens[i].width/2,aliens[i].py-aliens[i].height/2,"FFFFFF");
                aliens.splice(i,1);
                bullet.px=-100;
                shooting=false;
                i=i-1;
                if(soundenabled) explode.play();
                continue;
            }
            else if(pg.py+pg.height>aliens[i].py-35 && pg.py<aliens[i].py+aliens[i].height-35 && pg.px+pg.width>aliens[i].px && pg.px<aliens[i].px+aliens[i].width)
            {
                gameover();
                return;
            }
            if(aliens.px>aliens[i].px) aliens.px=aliens[i].px;
            if(aliens.px+aliens.width<aliens[i].px+aliens[i].width) aliens.width=aliens[i].px+aliens[i].width-aliens.px;
        }
        if(aliens.px<20 && aliens.dx<0)
        {
            if(soundenabled) alienmovedown.play();
            aliens.dx=-aliens.dx;
            for(i=0;i<aliens.length;i++) aliens[i].py+=35;
        }
        else if(aliens.px+aliens.width>780 && aliens.dx>0)
        {
            if(soundenabled) alienmovedown.play();
            aliens.dx=-aliens.dx;
            for(i=0;i<aliens.length;i++) aliens[i].py+=35;
        }

        //spara
        if(!shooting && Kpressed[76])
        {
            if(soundenabled) shoot.play();
            shooting=true;
            bullet.px=pg.px+48;
            bullet.py=555;
            bullet.dy=-12;
        }
        else if(shooting)
        {
            ctx.fillStyle="#FFFFFF";
            ctx.fillRect(bullet.px,bullet.py,3,5);
            bullet.py+=bullet.dy;
            if(bullet.py<-10) shooting=false;
        }

        drawPg();
        if(aliens.length==0) levelUp();
    }
    else if(level==6)
    {
        drawLightning();
        ctx.save();
        if(progressLevel<100)
        {
            ctx.translate(rand(-1,2),rand(-2,2));
            if(soundenabled) earthquake.play();
        }
        if(progressLevel>200)
        {
            ctx.translate(rand(-4,4),rand(-4,4));
            if(soundenabled) earthquake.play();
        }
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="ALLW";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25-200+progressLevel*10);
            if(progressLevel<200) ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-200);
            else if(progressLevel==200) hurtParticle(canvasW-10,i*25-200,"#7B7B7B");
        }
        drawPg();
        if(progressLevel>100)
        {//THE FIRE!
            ctx.font = "50px Courier";
            string="FIREWALL";
            for(k=0;k<5;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+3*k)%string.length],progressLevel-140-k*30,i*35+35);          
            }
        }
        if(progressLevel>150)
        {//la O
            ctx.fillStyle="#00FF00";
            ctx.font = "60px Arial";
            ctx.fillText("O",(progressLevel-150)*15-200,pg.py+45);
            if((progressLevel-150)*15-150>pg.px)
            {
                pg.px+=15;
                pg.py-=4;
            }
        }
        ctx.restore();
        progressLevel++;
        if(progressLevel>230) levelUp();
    }
    else if(level==7)
    {
        drawLightning();
        playStars();

        //il goal
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("The END of the W____",850-(progressLevel/2),100);

        //movimento
        speed=5;
        if(Kpressed[79]) pg.dx=-speed;
        else if(Kpressed[68]) pg.dx=+speed;
        else pg.dx=0;
        if(Kpressed[82]) pg.dy=-speed;
        else if(Kpressed[76]) pg.dy=+speed;
        else pg.dy=0;
        if(pg.px>640 && pg.dx>0) pg.dx=0;
        if(pg.py>555 && pg.dy>0) pg.dy=0;
        if(pg.py<0 && pg.dy<0) pg.dy=0;
        //ostacoli
        for(i=0;i<ostacoli.length;i++)
        {
            if(pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width && pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height)
            {
                pg.dx=ostacoli[i].dx;
                hurtParticle(ostacoli[i].px,ostacoli[i].py+ostacoli[i].height/2,"#7B7B7B");
                if(soundenabled) tonfo.play();
            }
            ostacoli[i].draw();
            if(ostacoli[i].px<-100)
            {
                ostacoli.splice(i,1);
                i=i-1;
            }
        }

        drawPg();

        //THE FIRE!
        ctx.font = "50px Courier";
        string="FIREWALL";
        for(k=0;k<20;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+7*k)%string.length],(progressLevel/5)-30-k*30,i*35+35);          
            }
        if(pg.px+20<progressLevel/5) gameover();
        progressLevel++;
        if(progressLevel>1350)
        {
            if(pg.py>35 && pg.py<70 && pg.px>620-progressLevel/2+700 && pg.px<660-progressLevel/2+700)
            {
                offsetWon=progressLevel;
                levelUp();
            }
        }
    }
    else if(level==8)
    {//credits
        playStars();
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("The END of the WORLD",850-(offsetWon/2)-(progressLevel/8),100);

        //THE FIRE!
        ctx.font = "50px Courier";
        string="FIREWALL";
        for(k=0;k<20;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+7*k)%string.length],(offsetWon/5)-30-k*30-progressLevel*3,i*35+35);          
            }
        if(progressLevel>250)
        {
            ctx.save();
            ctx.fillStyle="#FFFFFF";
            ctx.font = "50px Arial";
            if(progressLevel>400) ctx.globalAlpha=(500-progressLevel)/100;
            else ctx.globalAlpha=(progressLevel-250)/200;
            if(progressLevel>500) ctx.globalAlpha=0;
            ctx.fillText("A game by Infernet89",130,400);
            ctx.restore();
        }

        progressLevel++;
        //document.title=progressLevel;
        if(progressLevel>600)
        {
            level=-1;
            levelUp();
        }
    }
    drawParticle();

    translateMouseIntoKeyboard();
}
function gameover()
{
    if(soundenabled) fire.play();
    //return;
    nGameOvers++;
    level--;
    levelUp();
}
function levelUp()
{
    while(particles.length>0) particles.pop();
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
        quanti=rand(3,15)-nGameOvers;
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=15;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        quanti=rand(2,10)-nGameOvers;
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=canvasW-80;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        //il fuoco, più lento
        quanti=rand(10,30)-nGameOvers;
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
        while(ostacoli.length>0) ostacoli.pop();
        pg.px=303;
        pg.py=400;
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
        pg.width=75;
        //rocce cadenti (meteoriti?)
        quanti=rand(20,40)-nGameOvers;
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=rand(20,canvasW-85);
            t.py=rand(-100,-10000);
            t.dy=rand(6,8);
            ostacoli.push(t);
        }
    }
    else if(level==4)
    {
        pg.ax=0;
        pg.dx=0;
        if(pg.px<62) pg.px=62;
    }
    else if(level==5)
    {
        while(aliens.length>0) aliens.pop();
        pg.px=pg.px-42;
        pg.width=115;
        if(pg.px<62) pg.px=62;
        pg.py=canvasH-46;
        shooting=false;
        bullet=new Object();
        //generiamo gli alieni
        string="ALIENS";
        for(k=0;k<3;k++)
            for(i=0;i<12;i++)
            {
                t=new Object();
                t.txt=string[i%string.length];
                t.px=40*i+20;
                t.py=35*k-72+18;
                t.width=35;
                t.height=35;
                aliens.push(t);
            }
        aliens.px=20;
        aliens.dx=3-nGameOvers/10;
        if(aliens.dx<1) aliens.dx=1;
        aliens.width=470;
    }
    else if(level==6)
    {
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
    }
    else if(level==7)
    {
        while(ostacoli.length>0) ostacoli.pop();
        pg.px=300;
        pg.py=300;
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
        pg.width=160;

        //generiamo rocce
        quanti=rand(25,50)-nGameOvers;
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=rand(1000,14000);
            t.py=rand(0,canvasH-75);
            t.dx=-rand(7,14)
            ostacoli.push(t);
        }
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
    ctx.fillStyle="#8B8B8B";
    ctx.fillText("O",x+28,y);
    ctx.fillStyle="#707070";
    ctx.fillText("C",x,y+35);
    ctx.fillStyle="#858585";
    ctx.fillText("K",x+28,y+35);
    ctx.restore();
}
function drawPg()
{
    //ctx.fillRect(pg.px,pg.py,pg.width,pg.height);
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
    else if(level<=4)
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
    else if(level<=6)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[82]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("R",0,0);
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",42,0);
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",76,0);
    }
    else if(level==7)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[79]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("O",0,0);
        if(Kpressed[82]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("R",44,0);
        ctx.globalAlpha=0.2;
        ctx.fillText("▲",34,0);
        ctx.globalAlpha=1;
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",86,0);
        ctx.globalAlpha=0.2;
        ctx.fillText("▼",76,0);
        ctx.globalAlpha=1;
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",120,0);
    }
    ctx.restore();

	//lo muovo
	pg.px+=pg.dx;
	pg.py+=pg.dy;
	pg.dx+=pg.ax;
	pg.dy+=pg.ay;
}
function keyDown(e) {
    useKeyboard=true;
	Kpressed[e.keyCode]=true;
	//alert(e.keyCode);
    if(e.keyCode==77)
    {
        soundenabled=!soundenabled;
        if(soundenabled) bgmusic.play();
        else bgmusic.pause();
    }
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
//EYE CANDY
function playStars()
{
    if(stars.length<=0)
    {
        //generiamo stars
        while(stars.length>0) stars.pop();
        quanti=rand(50,100);
        for(i=0;i<quanti;i++)
        {
            t=new Object();
            t.px=rand(0,canvasW*2);
            t.py=rand(0,canvasH);
            t.dx=-rand(20,22);
            stars.push(t);
        }
    }
    ctx.save();
    //stars di sottofondo
    ctx.fillStyle="#FFFFFF";
    ctx.globalAlpha=0.7;
    for(i=0;i<stars.length;i++)
    {
        ctx.fillRect(stars[i].px,stars[i].py,1,1);
        stars[i].px+=stars[i].dx;
        if(stars[i].px<0) stars[i].px+=canvasW*2;
    }
    ctx.restore();
}
function hurtParticle(x,y,color)
{
    for(ip=0;ip<10;ip++)
    {
        t=new Object();
        t.px=x;
        t.py=y;
        t.dx=rand(-3,3);
        t.dy=rand(-3,3);
        t.color=color;
        t.ttl=rand(5,20);
        particles.push(t);
    }
}
function drawParticle()
{
    ctx.save();
    for(ipd=0;ipd<particles.length;ipd++)
    {
        ctx.fillStyle=particles[ipd].color;
        ctx.fillRect(particles[ipd].px,particles[ipd].py,1,1);
        particles[ipd].px+=particles[ipd].dx;
        particles[ipd].py+=particles[ipd].dy;
        particles[ipd].ttl--;
        if(particles[ipd].ttl<=0)
        {
            particles.splice(ipd,1);
            ipd=ipd-1;
        }
    }
    ctx.restore();
}
function drawLightning()
{
    ctx.restore();
    if(--lightningDelay>0) return;
    if(lightningDelay==0)
    {
        if(soundenabled) thunder.play();
        lightningstartx=rand(0,canvasW);
    }
    if(lightningDelay<-5) lightningDelay=rand(200,600);
    ctx.save();
    ctx.globalAlpha=0.5;
    ctx.translate(rand(-1,2),rand(-2,2));
    ctx.fillStyle="#f4ff7d";
    ctx.font = "10px Arial";
    string="LIGHTNING";
    lightningoffset=0;
    for(il=0;il*10<=canvasH;il++)
    {
        ctx.fillText(string[il%string.length],lightningstartx-il*2+lightningoffset*10,il*10);
        if(rand(1,10)>7) lightningoffset++;
    }
    ctx.globalAlpha=1;
}
function drawRain()
{
    for(ip=0;ip<5;ip++)
    {
        t=new Object();
        t.px=rand(0,canvasW+150);
        t.py=0;
        t.dx=-2;
        t.dy=rand(3,6);
        t.color="#7dcdff";
        t.ttl=rand(50,200);
        particles.push(t);
    }
}
function drawCalcinacci()
{
    for(ip=0;ip<1;ip++)
    {
        t=new Object();
        t.px=rand(0,canvasW+150);
        t.py=0;
        t.dx=0;
        t.dy=rand(12,14);
        t.color="#7B7B7B";
        t.ttl=rand(50,200);
        particles.push(t);
    }
}
function drawShootingstar()
{
    if(--shootingStardelay>0) return;
    shootingStardelay=rand(10,50);
    t=new Object();
    t.px=rand(0,canvasW);
    t.py=0;
    t.dx=rand(-4,4)*7;
    t.dy=rand(32,34);
    t.color="#BBBBBB";
    t.ttl=15;
    particles.push(t);
    st=new Object();
    st.px=t.px+1;
    st.py=-1;
    st.dx=t.dx;
    st.dy=t.dy;
    st.color="#BBBBBB";
    st.ttl=12;
    particles.push(st);
    st=new Object();
    st.px=t.px-1;
    st.py=-1;
    st.dx=t.dx;
    st.dy=t.dy;
    st.color="#BBBBBB";
    st.ttl=12;
    particles.push(st);
    st=new Object();
    st.px=t.px;
    st.py=-1;
    st.dx=t.dx;
    st.dy=t.dy;
    st.color="#BBBBBB";
    st.ttl=12;
    particles.push(st);

}
//controlli mobile
function translateMouseIntoKeyboard()
{
    /*//debug per i controlli mobile
    ctx.fillStyle="#FFFF00";
    ctx.fillRect(mousex,mousey,20,20);
    ctx.fillStyle="#FF0000";
    ctx.fillRect(mouse2x,mouse2y,20,20);
    ctx.fillStyle="#00FF00";
    ctx.fillRect(mouse3x,mouse3y,20,20);*/
    if(level==0)
    {
        if(mousex>pg.px && mousex<pg.px+45 && mousey>pg.py && mousey<pg.py+50) Kpressed[68]=true;
        return;
    }
    if(useKeyboard) return;
    
    Kpressed[79]=false;//O
    Kpressed[82]=false;//R
    Kpressed[76]=false;//L
    Kpressed[68]=false;//D

    //HUD
    ctx.fillStyle="#FFFFFF";
    ctx.globalAlpha=0.1;
    if(level==7) ctx.fillRect(8,canvasH-28,26,25);
    if(level>4)ctx.fillRect(258,canvasH-28,26,25);
    if(level>2)ctx.fillRect(518,canvasH-28,26,25);
    if(level>0)ctx.fillRect(768,canvasH-28,26,25);
    ctx.globalAlpha=1;
    ctx.font = "30px Courier bold";
    if(level==7) ctx.fillText("O",10,canvasH-5);
    if(level>4)ctx.fillText("R",260,canvasH-5);
    if(level>2)ctx.fillText("L",520,canvasH-5);
    if(level>0)ctx.fillText("D",770,canvasH-5);

    //controlliamo i mouse
    if(mousex<50 && mousey>550) Kpressed[79]=true;
    else if(mouse2x<50 && mouse2y>550) Kpressed[79]=true;
    else if(mouse3x<50 && mouse3y>550) Kpressed[79]=true;

    if(mousex>250 && mousex<300 && mousey>550) Kpressed[82]=true;
    else if(mouse2x>250 && mouse2x<300 && mouse2y>550) Kpressed[82]=true;
    else if(mouse3x>250 && mouse3x<300 && mouse3y>550) Kpressed[82]=true;

    if(mousex>500 && mousex<550 && mousey>550) Kpressed[76]=true;
    else if(mouse2x>500 && mouse2x<550 && mouse2y>550) Kpressed[76]=true;
    else if(mouse3x>500 && mouse3x<550 && mouse3y>550) Kpressed[76]=true;

    if(mousex>740 && mousey>550) Kpressed[68]=true;
    else if(mouse2x>740 && mouse2y>550) Kpressed[68]=true;
    else if(mouse3x>740 && mouse3y>550) Kpressed[68]=true;
}
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
    if(evt.targetTouches.length<2) return;
    mouse2x = evt.targetTouches[1].pageX,
    mouse2y = evt.targetTouches[1].pageY;
    if(evt.targetTouches.length<3) return;
    mouse3x = evt.targetTouches[2].pageX,
    mouse3y = evt.targetTouches[2].pageY;
    

}
function cliccatoTap(evt)
{
    evt.preventDefault();
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
    if(evt.targetTouches.length<2) return;
    mouse2x = evt.targetTouches[1].pageX,
    mouse2y = evt.targetTouches[1].pageY;
    if(evt.targetTouches.length<3) return;
    mouse3x = evt.targetTouches[2].pageX,
    mouse3y = evt.targetTouches[2].pageY;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    mousey=-100;
    mousex=-100;
    mouse2y=-100;
    mouse2x=-100;
    mouse3y=-100;
    mouse3x=-100;
}
//uindows
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}