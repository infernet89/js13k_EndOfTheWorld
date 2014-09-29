BasicGame = {};

BasicGame.Boot = function (game) {
    window.phaserGame = game;
    
    game.state.add('Preloader', BasicGame.Preloader);
    game.state.add('MainMenu', BasicGame.MainMenu);
    game.state.add('Game', BasicGame.Game);
    game.state.add('WinMenu', BasicGame.WinMenu);

    orientated: false;
};

BasicGame.Boot.prototype = {

	preload: function () {
		// Here we can load the assets required for our preloader
	},

	create: function () {
        // Add the FGL plugin
        this.game.plugins.add(Phaser.Plugin.FGL);
    
		// Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
		this.game.input.maxPointers = 1;

		// Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
		this.game.stage.disableVisibilityChange = true;
		
		// Scaling stuff. It's recommended to use 'forceOrientation' in your games!
		this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.setScreenSize(true);

		this.game.scale.setShowAll();
		this.game.scale.refresh();

	    // By this point the preloader assets have loaded to the cache, we've set the game settings
	    // So now let's start the real preloader going
		this.game.state.start('Preloader');

	},

    gameResized: function (width, height) {
    	alert("blah");
        // This could be handy if you need to do any extra processing if the game resizes.
        // A resize could happen if for example swapping orientation on a device.
        
    },

    enterIncorrectOrientation: function () {
        BasicGame.orientated = false;
        //document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {
        BasicGame.orientated = true;
        //document.getElementById('orientation').style.display = 'none';

    }

};
