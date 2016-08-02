var lunchGameType = GAMETYPE.NEW;
var saveKey;

var mm_map;
var menuWindow;
var menuFilter;

var mainMenuState = {
    create: function(){
        
        game.onBlur.removeAll();
        game.input.onDown.add(mainMenu.onDownFunction, this);
        
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
        
        menuFilter = game.add.graphics();
    },
    update: function(){
        
    },
    render: function(){
        game.debug.text("Pixel Civilization 0.3 FPS: " + game.time.fps || '--' , 30, 970);
    }
    
};

var mainMenu = {
    x:1,
    y:1,
    
    getLastSave: function() {
        var newestSave = 
        {
            timeStamp: null,
            key: null
        };
        
        for(var i in keys)
        {
            var checkData = localStorage.getItem(keys[i]);
            if(checkData!=null)
            {
                checkData = JSON.parse(checkData);
                var tempTimeStamp = checkData['timeStamp'];
                if(newestSave.timeStamp < tempTimeStamp)
                {
                    newestSave.timeStamp = tempTimeStamp;
                    newestSave.key = keys[i];
                }
            }
        }
        if(newestSave.key == null)
        {
            return null;
        }
        return newestSave;
    },
    
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
        var upperBarFontSize = 40;
        var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
        var i = 0;
        
        this.createMainButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.CONTINUE);
        i++;
        
        this.createMainButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.NEWGAME);
        i++;
        
        this.createMainButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.LOADGAME);
        i++;
                
        this.createMainButton(500, startY+buttonInterScape*i, fontStyle, null, MAINMENUBUTTONS.SETTINGS);
        i++;
    },
    createMainButton: function (x, y, fontStyle, parent, buttonEnum) {
        var disableButtonFlag = false;
        var buttonBackground = 
        {
          width: 400,
          height: 100
        };
        var tempButton = game.add.text(0, 5 , buttonEnum.text , fontStyle);
                tempButton.alpha = 10/8;
                tempButton.anchor.set(0.5);
                tempButton.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                tempButton.stroke = '#000000';
                tempButton.padding.set(3, 3);
           
        if(buttonEnum.id == 1)
        {
            tempButton.y = 0;
            
            var lastSave = this.getLastSave();
            var labelFontStyle = { font: "18px Arial", fill: "#ffffff", align: "left"};
            var textString;
            
            if(lastSave != null)
            {
                var date = new Date(lastSave.timeStamp);
                
                textString = lastSave.key+": "+date.toUTCString();
            }
            else
            {
                tempButton.addColor('#b8b894', 0); 
                disableButtonFlag = true;
                textString = "No saves available";    
            }
            
            var tempLabel = game.add.text(0, 35 , textString , labelFontStyle);
            tempButton.addChild(tempLabel);
            
            tempLabel.alpha = 1;
            tempLabel.anchor.set(0.5);
            tempLabel.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
            tempLabel.stroke = '#000000';
            tempLabel.padding.set(1, 1);
        }    
        
        //disable settings button
        if(buttonEnum.id == 4) { disableButtonFlag = true; tempButton.addColor('#b8b894', 0);  }
        
           
        var tempButtonBackground = game.add.tileSprite(x, y, buttonBackground.width, buttonBackground.height, 'buttonbackground');
            tempButtonBackground.addChild(tempButton);
            if(parent != null) { parent.addChild(tempButtonBackground); }
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
                if(tempButtonBackground.wasLeftClicked && !disableButtonFlag)
                {
                    switch(buttonEnum.id)
                    {
                        case MAINMENUBUTTONS.CONTINUE.id:
                            mainMenu.startGame(lastSave.key, GAMETYPE.LOAD);
                        break;
                        
                        case MAINMENUBUTTONS.NEWGAME.id:
                            mainMenu.showMenuWindow(MAINMENUWINDOWS.NEWGAMESELECTSLOT);
                        break;
                        
                        case MAINMENUBUTTONS.LOADGAME.id:
                            mainMenu.showMenuWindow(MAINMENUWINDOWS.LOAD);
                        break;
                        
                        case MAINMENUBUTTONS.SETTINGS.id:
                            // open new menuWindow(settings)
                        break;
                    }
                }

                tempButtonBackground.wasLeftClicked = false;  
            });
                
            tempButtonBackground.events.onInputOver.add(function () {
                    if(!disableButtonFlag)
                    {
                        tempButton.strokeThickness = 4;
                    }
            });
                
            tempButtonBackground.events.onInputOut.add(function () {
                    tempButton.strokeThickness = 0;
            });
        return tempButtonBackground;
    },
    
    showMenuWindow: function (gametype) {
        
        menuFilter.beginFill(0x000000, 0.8);
        menuFilter.drawRect(0, 0, 1000, 1000);
        menuFilter.endFill();
        
        menuWindow = game.add.sprite(w/2, h/2, 'mainMenuWindowBox');
        menuWindow.anchor.setTo(0.5, 0.5);
        menuWindow.alpha = 0.8;
        menuWindow.inputEnabled = true;
        
        var labelFontStyle = { font: "50px Arial", fill: "#ffffff", align: "left"};

        var titleLabel = game.add.text(0, (-menuWindow.height/2) + 50 , gametype.title , labelFontStyle);
        menuWindow.addChild(titleLabel);
            
        titleLabel.alpha = 10/8;
        titleLabel.anchor.set(0.5);
        titleLabel.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
        titleLabel.stroke = '#000000';
        titleLabel.padding.set(3, 3);
        
        this.fillMenuWindow(gametype);
    },
    fillMenuWindow: function(windowType) {
    
        switch(windowType)
        {
            case MAINMENUWINDOWS.NEWGAMESELECTSLOT:
                
                this.getSavesBoxes(windowType, true);
            
            break;  
              
            case MAINMENUWINDOWS.LOAD:
                
                this.getSavesBoxes(windowType, false);
            
            break;    
        } 
    },
    hideMenuWindow: function () {
        menuWindow.destroy();
        menuFilter.clear();
    },
    
    getSavesBoxes: function (windowType, skipAutosave) {
           
        skipAutosave = skipAutosave || false;
            
        for(var i in keys)
        {
                if(skipAutosave && i == 0) { continue; }

                this.createSaveSlotButton(windowType, i);
        }   
    },
    createSaveSlotButton: function(windowType, i){
      
        var labelFontStyle = { font: "40px Arial", fill: "#ffffff", align: "left"}; 
      
        var aviableToLoad = false;
        var aviableToStartNewGame = false;

        var infoText;                
        var checkData = localStorage.getItem(keys[i]);
        if(checkData!=null)
                {
                    labelFontStyle.fill = "#ffffff";
                                    
                    checkData = JSON.parse(checkData);
                    var tempTimeStamp = new Date(checkData['timeStamp']);
                    
                    infoText = tempTimeStamp.toUTCString();
                    
                    aviableToLoad = true;
                    aviableToStartNewGame = false;
                }
                else
                {
                    labelFontStyle.fill = "#b8b894";
                    
                    infoText = "[Empty slot]";
                    
                    aviableToLoad = false;
                    aviableToStartNewGame = true;
                }
                
                if(windowType == MAINMENUWINDOWS.NEWGAMESELECTSLOT)
                {
                    labelFontStyle.fill = "#ffffff";    
                }
                
                var containerBackground = game.add.tileSprite(0, -230+(i*180), 400, 150, 'buttonbackground');
                menuWindow.addChild(containerBackground);
                containerBackground.anchor.set(0.5);
                containerBackground.alpha = 0.8;
                containerBackground.inputEnabled = true;
                
                var contenerBorder = game.add.graphics();
                containerBackground.addChild(contenerBorder);
                contenerBorder.lineStyle(2, 0xffffff, 1);
                contenerBorder.drawRect(-200, -75, 400, 150);
                
                
                labelFontStyle.font = '40px Arial';
                var keyLabel = game.add.text(0, -30, keys[i] , labelFontStyle);
                containerBackground.addChild(keyLabel);
                keyLabel.alpha = 10/8;
                keyLabel.anchor.set(0.5);
                keyLabel.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                keyLabel.stroke = '#000000';
                keyLabel.padding.set(3, 3);
                
                
                labelFontStyle.font = '25px Arial';
                var infoLabel = game.add.text(0, 50 , infoText , labelFontStyle);
                keyLabel.addChild(infoLabel);
                infoLabel.anchor.set(0.5);
                infoLabel.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                infoLabel.stroke = '#000000';
                infoLabel.padding.set(3, 3);
             
                containerBackground.events.onInputDown.add(function () {
                    if(game.input.activePointer.leftButton.isDown)
                    {
                        containerBackground.wasLeftClicked = true;  
                    }
                });
                
                containerBackground.events.onInputUp.add(function () {
                    if(containerBackground.wasLeftClicked)
                    {
                        if(windowType == MAINMENUWINDOWS.NEWGAMESELECTSLOT)
                        {
                            if(aviableToStartNewGame)
                            {
                                //empty slot -> proced
                                mainMenu.startGame(keys[i], GAMETYPE.NEW);
                            }
                            else
                            {
                                //some slot -> overide pop up
                            }
                        } 
                        else
                        {
                            if(aviableToLoad)
                            {
                                mainMenu.startGame(keys[i], GAMETYPE.LOAD);
                            }
                        }
                    }
                    else
                    {
                        
                    }
                        
                    containerBackground.wasLeftClicked = false;  
                });
                    
                containerBackground.events.onInputOver.add(function () {
                    if(windowType == MAINMENUWINDOWS.NEWGAMESELECTSLOT)
                    {
                        containerBackground.alpha = 1;
                    }
                    else
                    {
                        if(windowType == MAINMENUWINDOWS.LOAD && aviableToLoad)
                        {
                            containerBackground.alpha = 1;     
                        }
                    }
                });
                    
                containerBackground.events.onInputOut.add(function () {
                    if(windowType == MAINMENUWINDOWS.NEWGAMESELECTSLOT)
                    {
                        containerBackground.alpha = 0.8;
                    }
                    else
                    {
                        if(windowType == MAINMENUWINDOWS.LOAD && aviableToLoad)
                        {
                            containerBackground.alpha = 0.8;     
                        }
                    }
                });
    },
    
    startGame: function(saveSlot, gametype) {
        saveKey = saveSlot;
        lunchGameType = gametype;
        game.state.start('mainState');
    },
    
    onDownFunction: function(pointer) {
        if(pointer.rightButton.isDown)
        {
            mainMenu.hideMenuWindow();
        }
    }
    
    
};

