BasicGame.MainMenu = function (game) {
	this.playButton = null;
	this.moreGamesButton = null;
    this.grantAchievementButton = null;
    this.upgradeButton = null;
    
    this.brandingButton = null;
    
    this.titleText = null;
    this.unlockedText = null;
    
    this.achievementCounter = 1;
};

BasicGame.MainMenu.prototype = {

	create: function () {
	    this.game.stage.backgroundColor = '#FFFFFF';
	    
	    // Regular Phaser button for 'play game'!
        this.playButton        = this.add.button((640 - 450) / 2, 100, 'playgame', this.startGame, this);
        
        var buttonOffset = 0;
        if(this.game.fgl.crossPromotionEnabled == false) { buttonOffset = 65; }
        
        // Just like with regular Phaser buttons, you can have 'over', 'out' and 'down' frames!
        this.moreGamesButton   = this.add.fglMoreGamesButton((640 - 450) / 2, 165, 'moregames');
        this.grantAchievementButton   = this.add.button((640 - 450) / 2, 230 - buttonOffset, 'grantachievement', this.grantAchievement, this);
        this.upgradeButton     = this.add.fglUpgradeButton((640 - 450) / 2, 295 - buttonOffset, 'unlockpremium', this.unlockSuccess, this.unlockFailed);
        
        this.brandingButton    = this.add.fglPublisherBranding(20, 380, 200);
        
        this.titleText = this.add.text(100, 10, "FGL Phaser Sample", { font: "50px Arial", fill: "#ca4343" } );
        this.unlockedText = this.add.text(500, 68, "", { font: "30px Arial", fill: "#ca4343" } );
        
        this.unlockedText.angle = -15;
        
		// Show an FGL ad!
        this.game.fgl.showAd();
    },
    
    grantAchievement: function () {
        while(this.game.fgl.hasAchievement("Test Achievement #" + this.achievementCounter)) {
          this.achievementCounter++;
        }
        this.game.fgl.grantAchievement("Test Achievement #" + this.achievementCounter++);
    },
    
    unlockSuccess: function () {
        console.log(this);
    	if(this.upgradeButton != null) { // Remove the upgrade button!
			this.upgradeButton.destroy();
			this.upgradeButton = null;
		}
    },
    
    unlockFailed: function (game) {
    	// Do stuff here if you like!
    },

    displayScoreboard: function () {
        this.game.fgl.displayScoreboard();
    },

	update: function () {
		if(this.game.fgl.isPremium()) {
		    this.unlockedText.setText("Unlocked!");
		}
		else this.unlockedText.setText("");
	},

	startGame: function () {
		this.destroyAll();
		
		// And start the actual game
		this.game.state.start('Game');
	},

	destroyAll: function() {
		// Destroy all the menu items
		this.playButton.destroy();

		if(this.moreGamesButton != null) {
			this.moreGamesButton.destroy();
		}
		
		if(this.grantAchievementButton != null) {
		    this.grantAchievementButton.destroy();
		}

		if(this.upgradeButton != null) {
			this.upgradeButton.destroy();
		}

		if(this.brandingButton != null) {
			this.brandingButton.destroy();
		}
	}

};
