var lunchGameType = GAMETYPE.NEW;
var saveKey;

var mm_map;

var mainMenuState = {
    create: function(){
        
        game.onBlur.removeAll();
        
        game.cache.addTilemap('dynamicMap', null, mainMenu.createMap(), Phaser.Tilemap.CSV);
        mm_map = game.add.tilemap('dynamicMap', 10, 10);
        mm_map.addTilesetImage('tileset', 'tileset', 10, 10);
        mm_layer = mm_map.createLayer(0);
        mm_layer.resizeWorld();
        
        game.time.advancedTiming = true;
        
        mm_mapMovingTimer = game.time.create(false);
        mm_mapMovingTimer.loop(100, mainMenu.updateMap, this);
        mm_mapMovingTimer.start();
        
        mainMenu.createHUD();
        
    },
    update: function(){
        
    },
    render: function(){
        game.debug.text("FPS: " + game.time.fps || '--' , 30, 200);
    }
    
};

var mainMenu = {
    x:1,
    y:1,
    onBlur: function () { },
    
    updateMap: function () {
        //mm_map.putTile(game.rnd.between(0,1),mainMenu.x,mainMenu.y);
        /*
        mainMenu.x++;
        if(mainMenu.x>99) { mainMenu.x=0; mainMenu.y++;}
        mainMenu.y = (mainMenu.y>99) ? 0 : mainMenu.y;
        */
    },

    createMap: function () {
        var tileMap = '';
        
        for (var y = 0; y < 100; y++)
        {
            for (var x = 0; x < 100; x++)
            {
                /*
                if(game.rnd.between(0,10) > 9) tileMap += '1';
                else tileMap += '0';
                */
                tileMap += game.rnd.between(0,1);
                
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
    },
    
    createHUD: function () {
        var startY = 500-300;
        var buttonInterScape = 200;
        var upperBarFontSize = 45;
        var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
        var i = 0;
        
        this.createButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.CONTINUE);
        i++;
        
        this.createButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.NEWGAME);
        i++;
        
        this.createButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.LOADGAME);
        i++;
                
        this.createButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.SETTINGS);
        i++;
    },
    
    createButton: function (x, y, fontStyle, parent, buttonEnum) {
        var tempButton = game.add.text(0, 2.5 , buttonEnum.text , fontStyle);
                tempButton.alpha = 2;
                tempButton.anchor.set(0.5);
                tempButton.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                tempButton.stroke = '#000000';
                tempButton.padding.set(2, 2);
                
                
        var tempButtonBackground = game.add.tileSprite(x, y, 300, 70, 'buttonbackground');
            tempButtonBackground.addChild(tempButton);
            if(parent != null)
            {
                parent.addChild(tempButtonBackground);
            }
            tempButtonBackground.anchor.set(0.5);
            tempButtonBackground.alpha = 0.8;
            tempButtonBackground.inputEnabled = true;
            tempButtonBackground.events.onInputDown.add(function () {
                if(game.input.activePointer.leftButton.isDown)
                {
                        tempButtonBackground.wasLeftClicked = true;  
                }
            });
                
            tempButtonBackground.events.onInputUp.add(function () {
                if(tempButtonBackground.wasLeftClicked)
                {
                    switch(buttonEnum.id)
                    {
                        case MAINMENUBUTTONS.CONTINUE.id:
                            // check isAnySaveAvailable
                            //  -> select LastSave
                            //  -> set key
                            saveKey = 'autosave';
                            lunchGameType = GAMETYPE.LOAD;
                            game.state.start('mainState');
                        break;
                        
                        case MAINMENUBUTTONS.NEWGAME.id:
                            // open new menuWindow(new) 
                            //      -> selectSaveSlot
                            //      -> selectMapSize ?
                            //      -> selectTerrain ?
                            saveKey = 'autosave';
                            lunchGameType = GAMETYPE.NEW;
                            game.state.start('mainState');
                            
                            
                        break;
                        
                        case MAINMENUBUTTONS.LOADGAME.id:
                            // open new menuWindow(load)
                            
                            
                        break;
                        
                        case MAINMENUBUTTONS.SETTINGS.id:
                            // open new menuWindow(settings)
                            
                            
                        break;
                    }
                         
                         
                }
                else
                {
                         
                }
                    
                tempButtonBackground.wasLeftClicked = false;  
            });
                
            tempButtonBackground.events.onInputOver.add(function () {
                    tempButton.strokeThickness = 4;
            });
                
            tempButtonBackground.events.onInputOut.add(function () {
                    tempButton.strokeThickness = 0;
            });
        return tempButtonBackground;
    }
};