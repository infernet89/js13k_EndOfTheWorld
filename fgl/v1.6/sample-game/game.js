/**
 * FGL Ninja - an amazing sample game for the HTML5 SDK.
 * 
 * See the implementation guide and SDK docs for more detail,
 * or read the commented sections of this code to see the
 * implementation in action.
 */
var FGLNinja = function(canvas){
    
    // FGL SDK Hooks:
    
    // This function is called when we want to unlock the game:
    var tryUnlock = function() {
        if(fgl.isPremium()) return;
        
        fgl.inApp.initiateUnlockFunction(
            function(){
                
                // Refresh our menu to make sure the unlock button goes away
                // and the 'FULL VERSION!' text appears:
                this.updateMenu();
                
            },
            
            function(){
                // The unlock was cancelled, the user didn't pay, or some other
                // failure happened. Sad times :( BUT we don't do anything to
                // the user. Let's just refresh the menu to be sure it's up 
                // to date:
                this.updateMenu();
                
            }
        );
    };
    
    // This function is called when we want to grant an achievement
    var achievementCount = 1;
    var grantAchievement = function() {
        // Increment achievement number to exclude achievements we already unlocked
        while(fgl.hasAchievement("Test Achievement #" + achievementCount)) { achievementCount++; }
        
        fgl.grantAchievement("Test Achievement #" + achievementCount++);
    };
    
    // When we show the main menu, we also show an advert!
    var showMainMenu = function() {
        state = 'menu';
        
        // Note: fgl.showAd() does nothing if the game is unlocked by payment!
        fgl.showAd();
    }
    
    // Boot function, we hook some FGL functions here when setting up our menu:
    this.boot = function(){    
        // -- MAIN MENU --
    
        // More Games Button:
        menuHitAreas.push({
            x: 100,
            y: 400 - 80 + 20,
            width: 1024 - 200,
            height: 80,
            action: function(){
                if(fgl.crossPromotionEnabled){
                    fgl.showMoreGames();
                }
            }
        });
        
        // Achievement Button:
        menuHitAreas.push({
            x: 220,
            y: 480 - 80 + 20,
            width: 1024 - (220 * 2),
            height: 80,
            action: function(){
                grantAchievement();
            }
        });
        
        // Unlock Button:
        menuHitAreas.push({
            x: 300,
            y: 560 - 80 + 20,
            width: 1024 - 600,
            height: 80,
            action: function(){
                tryUnlock();
            }
        });
        
        // Branding:
        if(fgl.brandingEnabled){
            var brandingHitArea = {
                x: 10,
                y: 490,
                width: 250,
                height: 100,
                action: function(){
                    fgl.handleBrandingClick();
                }
            };
            
            // Our branding button is on both the main menu and the win page:
            menuHitAreas.push(brandingHitArea);
            winHitAreas.push(brandingHitArea);
        }
        
        // -- WIN MENU --
        
        winHitAreas.push({
            x: 100,
            y: 420 - 80,
            width: 1024 - 200,
            height: 80,
            action: function(){
                fgl.submitScore(score);
            }
        });
        
        // -- WIN/MAIN MENU OTHER FUNCTIONS --
        
        // 'Play game' button on the main menu page:
        menuHitAreas.push({
            x: 100,
            y: 320 - 80,
            width: 1024 - 200,
            height: 80,
            action: function(){
                time = 10;
                score = 0;
                state = 'game';
                timeClock = setInterval(tickTime, 1000);
                spawnClock = setInterval(spawnCircle, 200);
            }
        });
        
        // 'Main menu' button on the win page:
        winHitAreas.push({
            x: 300,
            y: 520 - 80,
            width: 1024 - 600,
            height: 80,
            action: showMainMenu
        });
        
        // Other initialisation things:
        fglImage.src = "game/fgl.png"
        setInterval(update, 30);
        ctx.lineCap = 'round';
        
        if(fgl.brandingEnabled){
            menuBrandingImage = new Image();
            menuBrandingImage.src = fgl.getBrandingLogo();
        }
        
        $(canvas).mousemove(checkMouse).click(checkMouse).on({ 'touchmove' : checkTouch });
        
        showMainMenu();
    };
    
    //////////////////////
    //    GAME SETUP 
    //////////////////////
    
    canvas.style.backgroundColor = '#EFEFEF';
    var ctx = canvas.getContext('2d');
    
    var fglImage = new Image();
    var score = 0;
    var time = 10;
    
    var circles = [];
    var mouse = [];
    
    var timeClock = 0;
    var spawnClock = 0;
    
    var menuHitAreas = [];
    var winHitAreas  = [];
    var menuBrandingImage;
    
    var state = 'menu';
    
    var spawnCircle = function(){
        if(state != 'game'){
            clearInterval(timeClock);
            clearInterval(spawnClock);
            return;
        }
        circles.push({
            x: 512 + ((Math.random() - 0.5) * 800), 
            y: 600, 
            xS: (Math.random() - 0.5) * 30, 
            yS: -(Math.random() * 15 + 20)
        });
    };
    
    var win = function(){
        state = 'win';
    }
    
    var tickTime = function(){
        if(state != 'game'){
            clearInterval(timeClock);
            clearInterval(spawnClock);
            return;
        }
        time--;
        if (time <= 0) {
            clearInterval(timeClock);
            clearInterval(spawnClock);
            setTimeout(win, 2000);
        }
    };
    
    var update = function(){
        switch(state){
            case 'game':
                updateGame();
            break;
            case 'menu':
                updateMenu();
            break;
            case 'win':
                updateWin();
            break;
        }
    }
    
    var updateMenu = function(){
        clearCanvas();
        
        ctx.fillStyle = "#720404";
        ctx.font = "120px 'Carter One'";
        ctx.textAlign = 'center';
        ctx.fillText("FGL Ninja", 512, 120);
        
        
        ctx.fillStyle = "#C94343";
        ctx.font = "80px 'Carter One'";
        ctx.fillText("Start Game", 512, 320);
        
        ctx.font = "60px 'Carter One'";
        if(fgl.crossPromotionEnabled){
            ctx.fillText("More Games", 512, 400); //-20
        }
        
        ctx.fillText("Grant Achievement", 512, 480);
        
        if(!fgl.isPremium()){
            if(fgl.unlockEnabled){
                ctx.fillText("Unlock Game", 512, 560); //+40
            }
        }else{
            ctx.font = "40px 'Carter One'";
            ctx.textAlign = 'right';
            ctx.fillText("FULL VERSION!", 850, 190);
        }
        
        if(fgl.brandingEnabled){
            ctx.drawImage(menuBrandingImage, 10, 600-10-menuBrandingImage.height);
        }
    }
    
    var updateWin = function(){
        clearCanvas();
        ctx.textAlign = 'center';
        
        ctx.fillStyle = "#720404";
        ctx.font = "120px 'Carter One'";
        ctx.fillText("FGL Ninja", 512, 120);
        
        ctx.font = "80px 'Carter One'";
        ctx.fillText("Final Score: " + score, 512, 320);
        
        ctx.fillStyle = "#C94343";
        ctx.fillText("Submit Score", 512, 420);
        
        ctx.font = "60px 'Carter One'";
        ctx.fillText("Main Menu", 512, 520);
        
        if(fgl.brandingEnabled){
            ctx.drawImage(menuBrandingImage, 10, 600-10-menuBrandingImage.height);
        }
    }
    
    var updateGame = function(){
        clearCanvas();
        
        ctx.textAlign = 'right';
        ctx.font = "50px 'Carter One'";
        ctx.fillText("Score: " + score, 1014, 60);
        ctx.fillText("Time: " + time + "s", 1014, 120);
        
        for (var i = 0; i < circles.length; i++) {
            circles[i].x += circles[i].xS;
            circles[i].y += circles[i].yS;
            circles[i].yS++;
            ctx.drawImage(fglImage, circles[i].x, circles[i].y);
            if(circles[i].y > 650) {
                circles.splice(i, 1);
                i--;
            }
        }
        
        ctx.strokeStyle = "#FF0000";
        
        if(mouse.length > 0){
            var lX = mouse[0][0];
            var lY = mouse[0][1];
            for(var x = 1; x < mouse.length; x++){
                ctx.lineWidth = x/1.5;
                ctx.beginPath();
                ctx.moveTo(lX,lY);
                lX = mouse[x][0];
                lY = mouse[x][1];
                ctx.lineTo(lX, lY);
                ctx.stroke();
            }
            
            mouse.shift();
        }
    };
    
    var checkTouch = function(e){
        e.preventDefault();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        checkInteraction(touch.pageX, touch.pageY);
    };
    
    var checkMouse = function(e){
        if((state == 'menu' || state == 'win') && e.type != 'click') return;
        checkInteraction(e.pageX, e.pageY);
    }
    
    var checkInteraction = function(x, y){
        // Scale the X and Y to local coordinates:
        x -= parseFloat(canvas.style.marginLeft);
        y -= parseFloat(canvas.style.marginTop);
        x /= parseFloat(canvas.style.width) /1024;
        y /= parseFloat(canvas.style.height)/600;
        
        switch(state){
            case 'menu':
                for(var i in menuHitAreas){
                    var area = menuHitAreas[i];
                    if(x > area.x && y > area.y && x < area.x + area.width && y < area.y + area.height){
                        area.action();
                    }
                }
            break;
            case 'win':
                for(var i in winHitAreas){
                    var area = winHitAreas[i];
                    if(x > area.x && y > area.y && x < area.x + area.width && y < area.y + area.height){
                        area.action();
                    }
                }
            break;
            case 'game':
                mouse.push([x,y]);
                if(mouse.length > 20) mouse.shift();
                
                var scorePerCircle = 1;
                
                for (var i = 0; i < circles.length; i++) {
                    if (x > circles[i].x && 
                        x < circles[i].x + 100 &&
                        y > circles[i].y &&
                        y < circles[i].y + 100) {
                        
                        circles.splice(i, 1);
                        i--;
                        score += scorePerCircle;
                        scorePerCircle++;
                    }
                }
            break;
        }
    };
    
    
    /**
     * This code uses a hack to fix some strange canvas rendering issues on
     * older Android browsers such as drawing a 'ghost' canvas that does not
     * obey margins. This should be called once per frame!
     */
    var opacityToggle = false;
    var opacityHack = function() {
        var opacityVal = 0.999999 + (opacityToggle ? 0 : 0.000001);
        opacityToggle = !opacityToggle;
        
        try {
            canvas.parentElement.style.opacity = opacityVal;
            canvas.parentElement.style.zIndex = "1";
        } catch(err) { }
        try {
            canvas.style.opacity = opacityVal;
            canvas.style.zIndex = "1";
        } catch(err) { }
    };
    
    var clearCanvas = function() {
    // Faster, but doesn't work on everything
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Slower but safer
    canvas.width = canvas.width;
    
    // Fix canvas problems on older Android browsers
    opacityHack();
    };
}