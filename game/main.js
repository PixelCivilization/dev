var mainState = {
    create:function(){
        
        create();
    },
    update:function(){
        
        update();
    },
    render:function(){
        
        render();
    },
    pauseUpdate:function(){
        
        pauseLogic.update();
    },
    shutdown:function(){
        saveGame('autosave');
    }
};

console.log("Pixel Civilization");

//#CONST
var w = 1000, h = 1000;

var pixelWalkTimePerPixel = 30;
//so: pixelspeed = 1[px]/pixelWalkTimePerPixel[ms]
var worksiteTile = 8;

//#Map
var map;
var mapLayerGround;

//#Game
var myPixelsGroup, unemployedPixelsGroup, constrPixelsGroup;
var woodcuttersPixelsGroup, farmersPixelsGroup, stonecuttersPixelsGroup, minersPixelsGroup;

var worldTime;

var resources = { };

var housingCoor  = [];
var storageCoor  = [];

var resourceCondBar;
var resourcePositionAndCondition = [];

//#HUD
var groupMenuBarsAndBoxes;
    var upperBar;
    var pixelsUpperBar;

    var logBox;
        var logLinesStack;
        var logLinesType;

    var lowerBar;
    var lowerBarMenu;
        //#Menu
        var mouseOverAnyMenu;
        var pauseMenuUpdateing;
        var displayedMenuEnum;
        var menuEnumLastPosition;
        
    var pauseMenu;
    var gameFilter;
    
//#Building
var buildingQueue = [];
var buildingModeEnabled = false;
var buildEnum;
var buildWidth, buildHeight;    //T0 DELETE AFTER CHANGES buildingTerrainCheck()
var buildMarker;
var buildProgressBar;

//#Map scrolling
var scrollingMap = false;
var scrollingStartMouseCoor;
var scrollingStartCameraCoor;

var globalStats = 
{
    clickCount: 0,
    resourcesGathered: [0,0,0,0],
    buildingsBuilded: 0,
    pixelsSpawned: 1
};

var stats = 
{
    clickCount: 0,
    resourcesGathered: [0,0,0,0],
    buildingsBuilded: 0,
    pixelsSpawned: 1
};

var cheats =
{
    unlockAll: false,
    freeBuildings: false,
    superFastPixels: false
};

var buildMarker2;

function create() {
    
    logLinesStack = ["","","","",""];
    logLinesType = [0,0,0,0,0];
    mouseOverAnyMenu = false;
    pauseMenuUpdateing = false;
    displayedMenuEnum = 0;
    menuEnumLastPosition = 0;
    
    var loadedData;
    
    if(lunchGameType == GAMETYPE.LOAD) 
    {
        loadedData = localStorage.getItem(saveKey);
        loadedData = JSON.parse(loadedData);
        load.gameData(loadedData);
    }
    else
    {
        //New game settings
        worldTime = [0,12,1,1,1];
        buildingQueue = [];
        resourcePositionAndCondition = [];
        housingCoor = [];
        storageCoor = [];
        
        tech = 
        {
            unlock1Constructors:        false,
            unlock2Farms:               false,
            unlock3Woodcutting:         false,
            unlock4Housing:             false,
            unlock5StorageExtension:    false
        };
        
        resources = {
            food: 5,
            foodCap: 10,
            foodCapReached: true,
            
            wood: 5,
            woodCap: 10,
            woodCapReached: true,
            
            stone: 0,
            stoneCap: 0,
            stoneCapReached: true,
            
            metal: 0,
            metalCap: 0,
            metalCapReached: true,
            
            homeCap: 2
        };
        
        stats = {
            clickCount: 0,
            resourcesGathered: [0,0,0,0],
            buildingsBuilded: 0,
            pixelsSpawned: 1
        };
    
    }
    
    
    game.stage.disableVisibilityChange = false;
    
    game.input.onDown.add(onDownFunction, this);
    game.input.onUp.add(onUpFunction, this);
    game.input.addMoveCallback(pointerMoved, this);
    game.onBlur.add(showPauseMenu, this);
    
    if(lunchGameType == GAMETYPE.NEW)
    {
        map = game.add.tilemap('map', 10, 10);
    }
    else
    {
        game.cache.addTilemap('dynamicMap', null, loadedData['mapString'], Phaser.Tilemap.CSV);
        map = game.add.tilemap('dynamicMap', 10, 10);
    }
    map.addTilesetImage('tileset', 'tileset', 10, 10);
    mapLayerGround = map.createLayer(0);
    mapLayerGround.resizeWorld();
    
    if(cheats.unlockAll)
    {
         tech.unlock1Constructors = true;
         tech.unlock2Farms = true;
         tech.unlock3Woodcutting = true;
         tech.unlock4Housing = true;
         
         techMetalDiscovered = true;
         techStoneDiscovered = true;
    }
    
    buildMarker = game.add.graphics();
    buildMarker2 = game.add.graphics();
    buildProgressBar = game.add.graphics();
    resourceCondBar = game.add.graphics();
    
    myPixelsGroup = game.add.group();
    
    unemployedPixelsGroup = game.add.group();
    unemployedPixelsGroup.name = 'unemployedPixelsGroup';
    
    woodcuttersPixelsGroup = game.add.group();
    woodcuttersPixelsGroup.name = 'woodcuttersPixelsGroup';
    
    farmersPixelsGroup = game.add.group();
    farmersPixelsGroup.name = 'farmersPixelsGroup';
    
    stonecuttersPixelsGroup = game.add.group();
    stonecuttersPixelsGroup.name = 'stonecuttersPixelsGroup';
    
    minersPixelsGroup = game.add.group();
    minersPixelsGroup.name = 'minersPixelsGroup';
    
    constrPixelsGroup = game.add.group();
    constrPixelsGroup.name = 'constrPixelsGroup';
    
    myPixelsGroup.add(unemployedPixelsGroup);
    myPixelsGroup.add(woodcuttersPixelsGroup);
    myPixelsGroup.add(farmersPixelsGroup);
    myPixelsGroup.add(stonecuttersPixelsGroup);
    myPixelsGroup.add(minersPixelsGroup);
    myPixelsGroup.add(constrPixelsGroup);
    
    if(lunchGameType == GAMETYPE.NEW)
    {
        createPixel();
    }
    else 
    {
        loadedData['pixelsArray'].forEach(load.pixel);
    }
    
    //SETUP HUD
    {
        groupMenuBarsAndBoxes = game.add.group();
        {
             var upperBarFontSize = 24;
             var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left", tabs: [ 250, 250, 250] };
        
            upperBar = groupMenuBarsAndBoxes.create(0, 0, 'upperBar');
                var labelResources = game.add.text(15, ((upperBar.height - upperBarFontSize)/2) , " ", fontStyle);
                labelResources.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                labelResources.alpha = 2;
            upperBar.addChild(labelResources);
        }
        {
            var pixelsUpperBarFontSize = 16;
            var pixelsUpperBarfontStyle = { font: pixelsUpperBarFontSize+"px Arial", fill: "#ffffff", align: "left", tabs: [ 120, 150, 10] };
            
            pixelsUpperBar = groupMenuBarsAndBoxes.create(0, upperBar.height, 'pixelsUpperBar');
                var pixelsUpperBarLabel = game.add.text(15, ((pixelsUpperBar.height - pixelsUpperBarFontSize)/2)-1 , " ", pixelsUpperBarfontStyle);
                pixelsUpperBarLabel.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
                pixelsUpperBarLabel.alpha = 2;
            pixelsUpperBar.addChild(pixelsUpperBarLabel);
        }
        {
            logBox = groupMenuBarsAndBoxes.create(w, upperBar.height, 'logBox');
            logBox.anchor.x = 1;
                var logBoxLabel = game.add.text(-logBox.width + 10, 10 , "", pixelsUpperBarfontStyle);
                logBoxLabel.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
                logBoxLabel.alpha = 2;
            logBox.addChild(logBoxLabel);
        }
        {
            lowerBar = groupMenuBarsAndBoxes.create(0, h, 'lowerBar');
            updateLowerBar(true);
        }
        {
            lowerBarMenu = groupMenuBarsAndBoxes.create(-300, lowerBar.y-lowerBar.height-400, 'lowerBarMenu');
            
        }
        
        groupMenuBarsAndBoxes.setAll('inputEnabled', true);
        groupMenuBarsAndBoxes.setAll('alpha', 0.5);
        groupMenuBarsAndBoxes.setAll('fixedToCamera', true);
        groupMenuBarsAndBoxes.callAll('events.onInputOver.add', 'events.onInputOver',   function() {    mouseOverAnyMenu = true;    });
        groupMenuBarsAndBoxes.callAll('events.onInputOut.add',  'events.onInputOut',    function() {    mouseOverAnyMenu = false;   });
    }
    
    game.time.advancedTiming = true;
    
    var pixelSpawnerTimer = game.time.create(false);
    pixelSpawnerTimer.loop(game.rnd.integerInRange(4000, 8000), pixelsSpawner, this);
    pixelSpawnerTimer.start();

    var worldTimeTimer = game.time.create(false);
    worldTimeTimer.loop(50, updateWorldTime, this);
    worldTimeTimer.start();
    
    gameFilter = game.add.graphics();
    
    if(lunchGameType == GAMETYPE.LOAD)
    {
        load.drawings(loadedData);
    }
}


function update() {
    if(!pauseMenuUpdateing) { updateMenu(); }     
    updateResourcesLabel();

}

function render() {
    
    //game.debug.text(resourcePositionAndCondition.length + " " + "" + " " + "" + ""  + " ", 30 ,185);
    
    game.debug.text(getTimeString(), 30, 145);

    game.debug.text( "FPS: " + game.time.fps || '--' , 30, 200);
    
    //game.debug.inputInfo(30, 125);
    //game.debug.spriteInfo(lowerBarMenu, 32, 125);
    //game.debug.spriteBounds(lowerBarMenu.getChildAt(1));
}

function pointerMoved(pointer) {
        
    drawBuildMarker();
    moveCamera();
    
}
function onUpFunction(pointer) {
    scrollingMap = false;
    
}
function onDownFunction(pointer) {
    
    stats.clickCount++;
    
    if(game.paused)
    {
        if(pointer.rightButton.isDown)
        {
            hidePauseMenu();
        }
        else
        {
            if(lowerBar.getChildAt(lowerBar.children.length-1).getBounds().contains(game.input.x, game.input.y))
            {
                hidePauseMenu();
            }
            else
            {
                pauseLogic.onDownFunction();
            }
        }
    }
    else 
    {
        if(pointer.leftButton.isDown && game.state.getCurrentState().key == 'mainState')
        {
            if(!mouseOverAnyMenu && buildingModeEnabled && buildMarker.tint == 0x00ff00)
            {
                tryToBuild();
            }
            
            if(!mouseOverAnyMenu)
            {
                scrollingStartCameraCoor = new Phaser.Point(game.camera.x, game.camera.y);
                scrollingStartMouseCoor = new Phaser.Point(game.input.x, game.input.y);
                scrollingMap = true;
            }
            
        }
        if(pointer.rightButton.isDown)
        {
                if(buildingModeEnabled)
                {
                    buildingModeEnabled = false;
                    drawBuildMarker();
                    changeMenu(menuEnumLastPosition);
                }
                else 
                {
                    
                    if(displayedMenuEnum != 0)
                    {
                        changeMenu(Math.floor(displayedMenuEnum/10));
                    }
                }
        }
    }
}

function moveCamera() {
    if(scrollingMap && !buildingModeEnabled)
    {
        game.camera.x = scrollingStartCameraCoor.x + (scrollingStartMouseCoor.x - game.input.x);
        game.camera.y = scrollingStartCameraCoor.y + (scrollingStartMouseCoor.y - game.input.y);
    }
}

function updateWorldTime() {
    //add 1 minute inGameTime
    worldTime[0] += 1;
    //Minutes
    if(worldTime[0] == 60) {
        worldTime[0] = 0;
        worldTime[1] += 1;
    }
    //Hours
    if(worldTime[1] == 24) {
        worldTime[1] = 0;
        worldTime[2] += 1;
    }
    //Days
    if(worldTime[2] == 31) {
        worldTime[2] = 1;
        worldTime[3] += 1;
    }
    //Months
    if(worldTime[3] == 13) {
        worldTime[3] = 1;
        worldTime[4] += 1;
    }
    
}
function getTimeString() {
    var timeString = "["+worldTime[2]+"."+worldTime[3]+"."+worldTime[4]+" ";
    if(worldTime[1] < 10) { timeString += "0"; }
    timeString += worldTime[1]+":";
    if(worldTime[0] < 10) { timeString += "0"; }
    timeString += worldTime[0]+"]";
    return timeString;
}

function saveGame(saveslot) {
    var savedata = {};
    
    var d = new Date();
    savedata['timeStamp'] = d.getTime();
    savedata['mapString'] = getStringOfCurrentMap(map, mapLayerGround);
    savedata['pixelsArray'] = getPixelsArray();
    savedata['resources'] = resources;
    savedata['worldTime'] = worldTime;
    savedata['buildingQueue'] = buildingQueue;
    savedata['resourcePositionAndCondition'] = resourcePositionAndCondition;
    savedata['housingCoor'] = housingCoor;
    savedata['storageCoor'] = storageCoor;
    savedata['tech'] = tech;
    savedata['gameCamera'] = {x: game.camera.x, y: game.camera.y};
    savedata['gameStats'] = stats;
    
    localStorage.setItem(saveslot, JSON.stringify(savedata));
    writeLog("Game has been saved",2);
}

function getStringOfCurrentMap(map,mapLayer) {
    var tilesArray = mapLayer.getTiles(0, 0, map.width*10, map.height*10);
    if(tilesArray.length > 0)
    {
        
        var tileMap = '';
        var i = 0;
        
        for (var y = 0; y < map.height; y++)
        {
            for (var x = 0; x < map.width; x++)
            {
                tileMap += tilesArray[i].index;
                i++;
    
                if (x < map.width-1)
                {
                    tileMap += ',';
                }
            }
    
            if (y < map.height-1)
            {
                tileMap += "\n";
            }
        }
        return tileMap;
        
    }
    else 
    {  
//console.log("Error while getting tile to check");
        return null;
    }
}
function getPixelsArray() {
    var i=0;
    var tempPixsArray = [];
        myPixelsGroup.forEach(function(subGroup) {
            subGroup.forEach(function(tempPix) {
                var tempWorkRoutine = tempPix.workRoutine;
                if( (tempPix.workRoutine == 1 || tempPix.workRoutine == 3) && tempPix.wanderCount == 0) 
                { 
                    tempWorkRoutine--;
                }
                if( tempPix.workRoutine == 4)
                {
                    tempWorkRoutine = 0;
                }
                
                var basicTempPix = {
                    id:             tempPix.id,
                    x:              tempPix.x,
                    y:              tempPix.y,
                    parent:         tempPix.parent.name,
                    backpack:       tempPix.backpack,
                    workRoutine:    tempWorkRoutine,
                    wanderCount:    tempPix.wanderCount,
                    wanderTarget:   tempPix.wanderTarget
                };
                tempPixsArray[i] = basicTempPix;
                i++;
                
            });
        });
    return tempPixsArray;
}

var load = {
    pixel: function (element, index, array) {
    switch(element.parent)
    {
        case "unemployedPixelsGroup":
            spawnGroup = unemployedPixelsGroup;
        break;
        
        case "farmersPixelsGroup":
            spawnGroup = farmersPixelsGroup;
        break;
        
        case "woodcuttersPixelsGroup":
            spawnGroup = woodcuttersPixelsGroup;
        break;
        
        case "stonecuttersPixelsGroup":
            spawnGroup = stonecuttersPixelsGroup;
        break;
        
        case "minersPixelsGroup":
            spawnGroup = minersPixelsGroup;
        break;
        
        case "constrPixelsGroup":
            spawnGroup = constrPixelsGroup;
        break;
        
        default:
            spawnGroup = unemployedPixelsGroup;
        break;
    }
        
    var tempPixel = spawnGroup.create(element.x, element.y, 'blkPix');
        tempPixel.id = element.id;
        tempPixel.name = 'Pixel#' + element.id;
        tempPixel.backpack = element.backpack;
        tempPixel.workRoutine = element.workRoutine;
        tempPixel.wanderCount = element.wanderCount;
        tempPixel.wanderTarget = element.wanderTarget;
        tempPixel.capWasFull  = false;
    },
    gameData: function (loadedData) {
        resources = loadedData['resources'];
        worldTime = loadedData['worldTime'];
        buildingQueue = loadedData['buildingQueue'];
        resourcePositionAndCondition = loadedData['resourcePositionAndCondition'];
        housingCoor = loadedData['housingCoor'];
        storageCoor = loadedData['storageCoor'];
        tech = loadedData['tech'];
        stats = loadedData['gameStats'];
    },
    drawings: function (loadedData) {
        updateBuildingProgressBar();
        resourcePositionAndCondition.forEach(drawResourceBar);
        game.camera.x = loadedData['gameCamera'].x;    
        game.camera.y = loadedData['gameCamera'].y;
        writeLog("Game has been loaded",2);
        
        myPixelsGroup.forEach(function(subGroup) {
            subGroup.forEach(function(tempPix) {
                nextPixelTween(tempPix);
            });
        });

    }
    
};


var pauseLogic = {
    update: function() {
        for(var i=0; i<pauseMenu.children.length; i++)
        {
            if(this.isPointerOver(pauseMenu.getChildAt(i)))
            {
               pauseMenu.getChildAt(i).strokeThickness = 4; 
            }
            else
            {
                pauseMenu.getChildAt(i).strokeThickness = 0; 
            }
        }
    },
    isPointerOver: function(obj) {
        var objBounds = obj.getBounds();
        var objPointLeftTop = new Phaser.Point(objBounds.x, objBounds.y);
        var objPointRightBottom = new Phaser.Point(objBounds.x+objBounds.width, objBounds.y+objBounds.height);
        if(objPointRightBottom.x > game.input.activePointer.position.x && game.input.activePointer.position.x > objPointLeftTop.x)
        {   
            if(objPointRightBottom.y > game.input.activePointer.position.y && game.input.activePointer.position.y > objPointLeftTop.y)
            {
                return true;
            }
        }
        return false;
    },    
    onDownFunction: function() {
        for(var i=0; i<pauseMenu.children.length; i++)
        {
            if(this.isPointerOver(pauseMenu.getChildAt(i)))
            {
                switch(i)
                {
                    case 0:
                        game.paused = false;
                        //change key
                        saveGame('autosave');
                        game.paused = true; 
                    break;
                    
                    case 2:
                        game.paused = false;
                        game.state.start('mainMenu');
                    break;
                    
                    case 3:
                        game.paused = false;
                        game.scale.refresh();
                        game.scale.startFullScreen();
                        game.paused = true;    
                    break;
                }
            }
        }
    }
};

