var loadState = {
    preload:function(){
        
        var loadingLabel = game.add.text(500, 500, 'loading...', 
                            {font: '30px Courier', fill: '#ffffff'}); 
        loadingLabel.anchor.setTo(0.5);
        //  This sets a limit on the up-scale
        game.scale.maxWidth  = 1000;
        game.scale.maxHeight = 1000;
        game.scale.minWidth  = 600;
        game.scale.minHeight = 600;

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
        
        game.load.spritesheet('myPixels', 'assets/myPixel.png', 10, 10, 8);
        game.load.spritesheet('blkPix', 'assets/blackPix.png', 2, 2, 1);
    },
    create:function(){
        //this when intro done
        //game.state.start('intro');

        game.state.start('mainMenu');

        //game.state.start('mainState');
    }
};