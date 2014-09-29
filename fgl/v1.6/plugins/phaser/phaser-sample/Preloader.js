BasicGame.Preloader = function (game) {
	this.background = null;

    this.loadingText = null;
};

BasicGame.Preloader.prototype = {

	preload: function () {
	    this.game.stage.backgroundColor = '#FFFFFF';
	    
        // Here we load the rest of the assets our game needs.
        this.load.image('playgame', 'assets/play_game.png');
        this.load.image('moregames', 'assets/more_games.png');
        this.load.image('grantachievement', 'assets/grant_achievement.png');
        this.load.image('unlockpremium', 'assets/unlock_premium.png');
        this.load.image('endgame', 'assets/end_game.png');
        this.load.image('submitscore', 'assets/submit_score.png');
        this.load.image('backtomainmenu', 'assets/back_to_main_menu.png');
	},

	create: function () {
		this.game.state.start('MainMenu');
	}
};
