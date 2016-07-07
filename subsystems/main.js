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
        
    }
};

console.log("Pixel Civilization");

var w = 1000, h = 1000;

//#Map
var map;
var mapLayerGround;

//#Game
var myPixelsGroup, unemployedPixelsGroup;
var woodcuttersPixelsGroup, farmersPixelsGroup, stonecuttersPixelsGroup, minersPixelsGroup;
var constrPixelsGroup;
var myPixelsCount = 1;

var pixelWalkTimePerPixel = 30;
//so: pixelspeed = 1[px]/pixelWalkTimePerPixel[ms]

var food = 5;
var foodCap = 5;
var foodCapReached = true;

var wood = 5;
var woodCap = 5;
var woodCapReached = true;

var stone = 0;
var stoneCap = 0;
var stoneCapReached = true;

var metal = 0;
var metalCap = 0;
var metalCapReached = true;

var homeCap = 2;
var resourcePositionAndCondition = [];
var resourceCondBar;
var housingCoor  = [];
var storageCoor  = [];

//#HUD
var groupMenuBarsAndBoxes;
    var upperBar;
    var pixelsUpperBar;

    var logBox;
        var logLinesStack = ["","","","",""];
        var logLinesType = [0,0,0,0,0];

    var lowerBar;
    var lowerBarMenu;
        var displayedMenuEnum = 0;
        var menuEnumLastPosition = 0;
        var lowerBarMenuTween;
        
//#Menu
var mouseOverAnyMenu = false;
var pauseMenuUpdateing = false;

var pauseMenu;

//#Building
var buildingQueue = [];
var buildingModeEnabled = false;
var buildEnum;
var buildWidth, buildHeight;    //T0 DELETE AFTER CHANGES buildingTerrainCheck()
var buildMarker;
var buildProgressBar;
var worksiteTile = 8;

//#Technology and unlock
var tech1UnlockConstructors = false;
var tech2UnlockFarms        = false;
var tech3UnlockWoodcutting  = false;
var tech4UnlockHousing      = false;
var tech5UnlockStorageExtension = false;

var techMetalDiscovered = false;
var techStoneDiscovered = false;


//#Timers 
var pixelSpawnerTimer;
var worldTimeTimer;
var worldTime = [0,12,1,1,1];

//#Map scrolling
var scrollingMap = false;
var scrollingStartMouseCoor;
var scrollingStartCameraCoor;

//#Stats
var statsClickCount = 0;
var statsResourcesGathered = [0,0,0,0]; 
var statsBuildingsBuilded = 0;
var statsPixelsSpawned = 0;

//#Cheats
var cheatsUnlockAll = false;
var cheatsfreeBuildings = false;
var cheatsSuperFastPixels = false;

 var gameFilter;
 var gameFilterAlpha = 0;

var buildMarker2;

function create() {
    
    game.stage.disableVisibilityChange = false;
    
    game.input.onDown.add(onDownFunction, this);
    game.input.onUp.add(onUpFunction, this);
    game.input.addMoveCallback(pointerMoved, this);
    game.onBlur.add(showPauseMenu, this);
    
    if(cheatsUnlockAll)
    {
         tech1UnlockConstructors = true;
         tech2UnlockFarms        = true;
         tech3UnlockWoodcutting  = true;
         tech4UnlockHousing      = true;
        
         techMetalDiscovered = true;
         techStoneDiscovered = true;
    }

    map = game.add.tilemap('map', 10, 10);
    
    map.addTilesetImage('tileset');
    mapLayerGround = map.createLayer(0);
    //game.world.setBounds(0, 0, 1000, 1000);
    mapLayerGround.resizeWorld();
    //map.setCollisionBetween(4,15, true, mapLayerGround, true);
    //mapLayerGround.debug = true;
    
    buildMarker = game.add.graphics();
    buildMarker2 = game.add.graphics();
    buildProgressBar = game.add.graphics();
    resourceCondBar = game.add.graphics();
    
    myPixelsGroup = game.add.group();
    unemployedPixelsGroup = game.add.group();
    woodcuttersPixelsGroup = game.add.group();
    farmersPixelsGroup = game.add.group();
    stonecuttersPixelsGroup = game.add.group();
    minersPixelsGroup = game.add.group();
    constrPixelsGroup = game.add.group();
    
    myPixelsGroup.add(unemployedPixelsGroup);
    myPixelsGroup.add(woodcuttersPixelsGroup);
    myPixelsGroup.add(farmersPixelsGroup);
    myPixelsGroup.add(stonecuttersPixelsGroup);
    myPixelsGroup.add(minersPixelsGroup);
    myPixelsGroup.add(constrPixelsGroup);
    {
        createPixel();
    }
    
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

    game.time.advancedTiming = true;
    
    pixelSpawnerTimer = game.time.create(false);
    pixelSpawnerTimer.loop(game.rnd.integerInRange(4000, 8000), pixelsSpawner, this);
    pixelSpawnerTimer.start();

    worldTimeTimer = game.time.create(false);
    worldTimeTimer.loop(50, updateWorldTime, this);
    worldTimeTimer.start();

    gameFilter = game.add.graphics();
}


function update() {
    if(!pauseMenuUpdateing) { updateMenu(); }     
    updateResourcesLabel();

}

function render() {
    
    //game.debug.text(resourcePositionAndCondition.length + " " + "" + " " + "" + ""  + " ", 30 ,185);
    
    game.debug.text(" " + " " + " " + worldTime[1] + ":" + worldTime[0], 30, 145);

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
    
    //Stats
    statsClickCount++;
    
        //game.scale.refresh();
        //game.scale.startFullScreen();
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
        }
    }
    else 
    {
        if(pointer.leftButton.isDown)
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
    
    //updateGameFilter();
    
}
function getTimeString() {
    var timeString = "["+worldTime[2]+"."+worldTime[3]+"."+worldTime[4]+" ";
    if(worldTime[1] < 10) { timeString += "0"; }
    timeString += worldTime[1]+":";
    if(worldTime[0] < 10) { timeString += "0"; }
    timeString += worldTime[0]+"]";
    return timeString;
}

function updateGameFilter() {
    //gameFilterAlpha += 0.1;
    
    var dayHours = 12;
    var nightHours = 12;
    
    if(worldTime[1] >= 12) { gameFilterAlpha += ((0.5/12)/60); }
    else { gameFilterAlpha -= ((0.5/12)/60); }
    
    gameFilter.clear();
    gameFilter.beginFill(0x000000, gameFilterAlpha);
    gameFilter.drawRect(0, 0, 1500, 2000);
    gameFilter.endFill();
}

function saveGame() {
    
}

function loadGame() {
    
}