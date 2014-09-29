BasicGame.WinMenu = function (game) {
	this.submitScoreButton = null;
	this.backToMainMenuButton = null;
	
    this.brandingButton = null;
    
    this.scoreText = null;
};

BasicGame.WinMenu.prototype = {

	create: function () {
	    this.game.stage.backgroundColor = '#FFFFFF';
	    
	    this.scoreText = this.game.add.text(0, 0, "Score: " + this.game.gameScore, { font: "65px Arial", fill: "#ca4343" } );
	    
        this.submitScoreButton = this.add.button((640 - 450) / 2, 200, 'submitscore', this.submitScore, this);
        this.backToMainMenuButton = this.add.button((640 - 450) / 2, 265, 'backtomainmenu', this.mainMenu, this);
        
        // Sometimes publishers like their branding on menus other than the main menu
        this.brandingButton = this.add.fglPublisherBranding(20, 380, 200);
        
		// Show another FGL ad!
        this.game.fgl.showAd();
    },
    
    submitScore: function () {
        this.game.fgl.submitScore(this.game.gameScore);
    },

	update: function () {

	},

	mainMenu: function (pointer) {
		// Destroy all the menu items
		this.submitScoreButton.destroy();
		this.backToMainMenuButton.destroy();

		if(this.moreGamesButton != null) {
			this.moreGamesButton.destroy();
		}
		
		if(this.brandingButton != null) {
			this.brandingButton.destroy();
		}
		
		// Back to main menu
		this.game.state.start('MainMenu');
	}

};
