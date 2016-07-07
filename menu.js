var cameraMovement;

var mainMenuState = {
    create: function(){

        game.cache.addTilemap('dynamicMap', null, generateMap(), Phaser.Tilemap.CSV);

        //  Create our map (the 10x10 is the tile size)
        map = game.add.tilemap('dynamicMap', 10, 10);
    
        //  'tiles' = cache image key, 16x16 = tile size
        map.addTilesetImage('tileset', 'tileset', 10, 10);
    
        //  0 is important
        layer = map.createLayer(0);
        
        layer.scale = new Phaser.Point (1,1);
        
        //  Scroll it
        layer.resizeWorld();
        
        
        game.time.advancedTiming = true;
        game.camera.onFadeComplete.add(resetCamera, this);
        
        mm_mapMovingTimer = game.time.create(false);
        mm_mapMovingTimer.loop(10000, fadeCamera, this);
        mm_mapMovingTimer.start();
        
        cameraMovement = new Phaser.Point(game.rnd.between(1,4),game.rnd.between(1,4));
    },
    update: function(){
        mm_moveCamera();
    },
    render: function(){
        
        game.debug.cameraInfo(game.camera, 32, 32);

        game.debug.text( "FPS: " + game.time.fps || '--' , 30, 200);
    }
    

    
};


    function generateMap() {
        var tileMap = '';
        
        for (var y = 0; y < 150; y++)
        {
            for (var x = 0; x < 150; x++)
            {
                if(game.rnd.between(0,10) < 2)
                {
                    tileMap += '1';
                }
                else
                {
                    tileMap += '0';
                }
    
                if (x < 199)
                {
                    tileMap += ',';
                }
            }
    
            if (y < 199)
            {
                tileMap += "\n";
            }
        }
        
        return tileMap;
    }

    function mm_moveCamera() {
        game.camera.x = game.camera.x + cameraMovement.y;
        game.camera.y = game.camera.x + cameraMovement.y;
    }
    
    function resetCamera() {
game.state.start('mainState');
        game.camera.x = 0;
        game.camera.y = 0;
        cameraMovement = new Phaser.Point(game.rnd.between(1,3),game.rnd.between(1,3));

        game.camera.flash(0x000000, 500);
    }
    
    function fadeCamera() {
        game.camera.fade(0x000000, 500);
    }