        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        WebFontConfig = {
        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
            //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
        //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {families: ['Lato']}
            
        };

var loadState = {
    preload:function(){
        
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        
        var loadingLabel = game.add.text(500, 500, 'loading...', 
                            {font: '30px Courier', fill: '#ffffff'}); 
        loadingLabel.anchor.setTo(0.5);
        //  This sets a limit on the up-scale
        game.scale.maxWidth  = 2000;
        game.scale.maxHeight = 2000;
        game.scale.minWidth  = 300;
        game.scale.minHeight = 300;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.refresh();
        game.scale.updateLayout();
        //game.scale.setScreenSize();
        
        var loadingBar = game.add.sprite(500, 550, 'loading');
        loadingBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(loadingBar);
    
        game.load.tilemap('map', 'assets/pixelTutorialMap_ground.csv');
            
        game.load.image('tileset',"assets/pixelCivilization.png");
        game.load.image('upperBar',"assets/upperBar.png");
        game.load.image('pixelsUpperBar',"assets/pixelsUpperBar.png");
        game.load.image('logBox',"assets/logBox.png");
        game.load.image('lowerBar',"assets/lowerBar.png");
        game.load.image('lowerBarMenu',"assets/lowerBarMenu.png");
        game.load.image('pauseMenu',"assets/pauseMenu.png");
        game.load.image('buttonbackground',"assets/buttonTile.png");
        game.load.image('mainMenuWindowBox',"assets/mainMenuWindowBox.png");

        
        game.load.spritesheet('myPixels', 'assets/myPixel.png', 10, 10, 8);
        game.load.spritesheet('blkPix', 'assets/blackPix.png', 2, 2, 1);
        
        game.lockByPopup = false;
    },
    create:function(){
        //this when intro done
        //game.state.start('intro');

        game.state.start('mainMenu');
    }
};