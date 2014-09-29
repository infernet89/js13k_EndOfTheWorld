BasicGame.Game = function (game) {

	// When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    var player = null;
    var level = null;
    var hud = null;


    // You can use any of these from any function within this State.
    // But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

	this.endButton = null;
	this.scoreText = null;
	
	game.gameScore = 0;
};

BasicGame.Game.prototype = {

	preload: function () {

    },

    create: function () {
		if(this.game.fgl.isPremium()) { // In premium mode, add 10000 points! Pay to win! :(
			this.game.gameScore = 10000;
		}
		else this.game.gameScore = 0;
		
		this.endButton = this.game.add.button((640 - 450) / 2, (480 / 2) - 30, 'endgame', this.quitGame, this);
		
		this.scoreText = this.game.add.text(0, 0, "Score: " + this.game.gameScore, { font: "65px Arial", fill: "#ca4343" } );
	},

	update: function () {
		// Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.game.gameScore++; // Increment score in this incredibly fun "game" of patience
        this.scoreText.setText("Score: " + this.game.gameScore);
	},

	quitGame: function (pointer) {

		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		this.endButton.destroy();
		this.scoreText.destroy();

		// Then let's go back to the main menu.
		this.game.state.start('WinMenu');

	}



};
