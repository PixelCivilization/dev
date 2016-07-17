var PIXELGROUPBUTTONTYPE = {
        REMOVE   : {id: 0, moveX: 30,  labelText: "Remove" },
        ADD      : {id: 1, moveX: 130, labelText: "Assign" }
};

function showPauseMenu() {
    if(!game.paused)
    {
        game.paused = true;
        
        gameFilter.beginFill(0x000000, 0.5);
        gameFilter.drawRect(0, 0, 1500, 2000);
        gameFilter.endFill();
        
        var pixelsUpperBarFontSize = 35;
        var pixelsUpperBarfontStyle = { font: pixelsUpperBarFontSize+"px Arial", fill: "#ffffff", align: "left", tabs: [ 120, 150, 10] };
    
        
        pauseMenu = game.add.sprite(w/2+game.camera.position.x, h/2+game.camera.position.y, 'pauseMenu');
        pauseMenu.anchor.setTo(0.5, 0.5);
        pauseMenu.alpha = 0.8;
        var startPosision = -(pauseMenu.height/2)+70;
        var labelsText = ["Save", "Load", "Main menu", "Fullscreen"];
        for(var i=0; i<4; i++)
        {
            var pauseMenuLabel = game.add.text(0, startPosision+(i*85), labelsText[i], pixelsUpperBarfontStyle);
            pauseMenuLabel.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
            pauseMenuLabel.stroke = '#000000';
            pauseMenuLabel.padding.set(3, 3);
            pauseMenuLabel.anchor.setTo(0.5);
            pauseMenu.addChild(pauseMenuLabel);
        }
    }
}
function hidePauseMenu() {
    gameFilter.clear();
    game.paused = false;
    pauseMenu.destroy();
    
}


function createButton(x, y, fontStyle, parent, menuEnum) {
        
        var tempButton = game.add.text(x, y , menuEnum.text , fontStyle);
                parent.addChild(tempButton);
                tempButton.alpha = 2;
                tempButton.anchor.y = 0.5;
                tempButton.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                tempButton.stroke = '#000000';
                tempButton.padding.set(2, 2);
                tempButton.inputEnabled = true;
                tempButton.events.onInputDown.add(function () {
                    if(game.input.activePointer.leftButton.isDown)
                    {
                        tempButton.wasLeftClicked = true;  
                    }
                });
                tempButton.events.onInputUp.add(function () {
                    if(tempButton.wasLeftClicked)
                    {
                        if(menuEnum.menuId == MENU.PAUSEMENU.menuId) 
                        {
                            if(!game.paused)
                            {
                                showPauseMenu();
                                mouseOverAnyMenu = false;
                                tempButton.strokeThickness = 0;
                            }
                        }
                        else
                        {
                            changeMenu(menuEnum.menuId);
                        }
                    }
                    tempButton.wasLeftClicked = false;  
                });
                tempButton.events.onInputOver.add(function () {
                        mouseOverAnyMenu = true;
                        tempButton.strokeThickness = 4;
                });
                tempButton.events.onInputOut.add(function () {
                        mouseOverAnyMenu = false;
                        tempButton.strokeThickness = 0;
                });
        return tempButton;
}

function createBuldingButton(x, y, fontStyle, parent, buildingEnum) {
        
        var tempButton = game.add.text(x, y , buildingEnum.name , fontStyle);
                parent.addChild(tempButton);
                tempButton.alpha = 2;
                tempButton.anchor.y = 0.5;
                tempButton.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                tempButton.stroke = '#000000';
                tempButton.padding.set(2, 2);
                tempButton.inputEnabled = true;
                tempButton.buildingEnum = buildingEnum;
                tempButton.events.onInputDown.add(function () {
                    if(game.input.activePointer.leftButton.isDown)
                    {
                        tempButton.wasLeftClicked = true;  
                    }
                });
                tempButton.events.onInputUp.add(function () {
                    if(tempButton.wasLeftClicked)
                    {
                        if(resourceCheck(buildingEnum))
                        {
                            buildEnum = buildingEnum;
                            buildWidth = buildingEnum.width;     //T0 DELETE AFTER CHANGES buildingTerrainCheck()
                            buildHeight   = buildingEnum.height; //T0 DELETE AFTER CHANGES buildingTerrainCheck()
                            buildingModeEnabled = true;
                            setBuildMarker();
                            changeMenu(0);
                            mouseOverAnyMenu = false;
                        }
                        else 
                        {
                            writeLog("Not enough resources to build "+buildingEnum.name+"!", 1);
                        }
                    }
                    tempButton.wasLeftClicked = false;  
                });
                tempButton.events.onInputOver.add(function () {
                        parent.getChildAt(0).text = buildingEnum.describe;
                        if(resourceCheck(buildingEnum))
                        {
                                mouseOverAnyMenu = true;
                                tempButton.strokeThickness = 4;
                        }
                });
                tempButton.events.onInputOut.add(function () {
                        mouseOverAnyMenu = false;
                        tempButton.strokeThickness = 0;
                });
        var newfontStyle = { font: "16px Arial", fill: "#ffffff", align: "left"};
        
        createLabel(0, (tempButton.height/2)+5, createResourcesText(buildingEnum), newfontStyle, tempButton);
        return tempButton;
}

function createPixelGroupButtons(parent, tartgetGroup) {
    var fontSize = 16;
    var fontStyle = { font: fontSize+"px Arial", fill: "#ffffff", align: "left"};
    
    var tempButton = game.add.text(PIXELGROUPBUTTONTYPE.REMOVE.moveX, parent.height, PIXELGROUPBUTTONTYPE.REMOVE.labelText , fontStyle);
                parent.addChild(tempButton);
                tempButton.anchor.y = 0.5;
                tempButton.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
                tempButton.stroke = '#000000';
                tempButton.padding.set(2, 2);
                tempButton.sourceGroup = tartgetGroup;
                tempButton.inputEnabled = true;
                tempButton.events.onInputUp.add(function () {
                    
                if(pixelsGroupsProcedureCheck(tempButton.sourceGroup))
                {
                    var movedPixel = tartgetGroup.getFirstAlive();
                    unemployedPixelsGroup.add(movedPixel);
                    movedPixel.workRoutine = 0;
                }
                else 
                {
                    writeLog("There is noone to remove!",1);
                }
                    
                });
                tempButton.events.onInputOver.add(function () {
                    if(pixelsGroupsProcedureCheck(tempButton.sourceGroup))
                    {
                        mouseOverAnyMenu = true;
                        tempButton.strokeThickness = 2;
                    }
                });
                tempButton.events.onInputOut.add(function () {
                        mouseOverAnyMenu = false;
                        tempButton.strokeThickness = 0;
                });
                
    var tempButton2 = game.add.text(PIXELGROUPBUTTONTYPE.ADD.moveX, parent.height, PIXELGROUPBUTTONTYPE.ADD.labelText , fontStyle);
                parent.addChild(tempButton2);
                tempButton2.anchor.y = 0.5;
                tempButton2.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
                tempButton2.stroke = '#000000';
                tempButton2.padding.set(2, 2);
                tempButton2.sourceGroup = unemployedPixelsGroup;
                tempButton2.inputEnabled = true;
                tempButton2.events.onInputUp.add(function () {
                    
                if(pixelsGroupsProcedureCheck(tempButton2.sourceGroup))
                {
                    var movedPixel = unemployedPixelsGroup.getFirstAlive();
                    tartgetGroup.add(movedPixel);
                }
                else 
                {
                    writeLog("There is not any idle pixel",1);
                }
                    
                });
                tempButton2.events.onInputOver.add(function () {
                    if(pixelsGroupsProcedureCheck(tempButton2.sourceGroup))
                    {
                        mouseOverAnyMenu = true;
                        tempButton2.strokeThickness = 2;
                    }
                });
                tempButton2.events.onInputOut.add(function () {
                        mouseOverAnyMenu = false;
                        tempButton2.strokeThickness = 0;
                });
            
}

function createLabel(x,y, labelText, fontStyle, parent) {
        var tempLabel = game.add.text(x, y , labelText , fontStyle);
                parent.addChild(tempLabel);
                tempLabel.alpha = 2;
                tempLabel.anchor.y = 0.5;
                tempLabel.setShadow(-1, 1, 'rgba(0,0,0,1)', 0);
                tempLabel.padding.set(2, 2);

        return tempLabel;
}

function createPixelsGroupLabel(x,y, labelText, fontStyle, parent, tartgetGroup) {
        var tempLabel = game.add.text(x, y , labelText , fontStyle);
                parent.addChild(tempLabel);
                tempLabel.alpha = 2;
                tempLabel.anchor.y = 0.5;
                tempLabel.setShadow(-2, 2, 'rgba(0,0,0,1)', 0);
                tempLabel.padding.set(2, 2);
        createPixelGroupButtons(tempLabel,tartgetGroup);

        return tempLabel;
}

function createResourcesText(buildingEnum) {
        var isBuilidngFree = true;
        var tempRecourcesLabel = "( ";
        if(buildingEnum.resToBuild[0] > 0) { tempRecourcesLabel = tempRecourcesLabel+"Food:"+buildingEnum.resToBuild[0]+" "; isBuilidngFree = false;}
        if(buildingEnum.resToBuild[1] > 0) { tempRecourcesLabel = tempRecourcesLabel+"Wood:"+buildingEnum.resToBuild[1]+" "; isBuilidngFree = false;}
        if(buildingEnum.resToBuild[2] > 0) { tempRecourcesLabel = tempRecourcesLabel+"Stone:"+buildingEnum.resToBuild[2]+" "; isBuilidngFree = false;}
        if(buildingEnum.resToBuild[3] > 0) { tempRecourcesLabel = tempRecourcesLabel+"Metal:"+buildingEnum.resToBuild[3]+" "; isBuilidngFree = false;}
        tempRecourcesLabel = tempRecourcesLabel+")";
        if(isBuilidngFree) { tempRecourcesLabel = ""; }
        return tempRecourcesLabel;
}

function fillMenu() {
        if(displayedMenuEnum == MENU.PIXELS.menuId)
        {
                var startY = 100;
                var buttonInterScape = 100;
                var upperBarFontSize = 30;
                var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                var i = 0;
                if(tech.unlock2Farms)
                {
                    createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.WORKERPIXELS);
                    i++;
                }
                createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.UTILITYPIXELS);
        }
            if(displayedMenuEnum == MENU.WORKERPIXELS.menuId)
            {
                    var startY = 50;
                    var buttonInterScape = 90;
                    var upperBarFontSize = 25;
                    var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                    var i = 0;
                    
                    createPixelsGroupLabel(30,startY+buttonInterScape*i,"Farmers: ", fontStyle, lowerBarMenu, farmersPixelsGroup);
                    i++;
                    if(tech.unlock3Woodcutting)
                    {
                        createPixelsGroupLabel(30,startY+buttonInterScape*i,"Woodcutters: ", fontStyle, lowerBarMenu, woodcuttersPixelsGroup);
                        i++;
                    }
                    if(techStoneDiscovered)
                    {
                        createPixelsGroupLabel(30,startY+buttonInterScape*i,"Stonecutters: ", fontStyle, lowerBarMenu, stonecuttersPixelsGroup);
                        i++;
                    }
                    if(techMetalDiscovered)
                    {
                        createPixelsGroupLabel(30,startY+buttonInterScape*i,"Miners: ", fontStyle, lowerBarMenu, minersPixelsGroup);
                        i++;
                    }
            }
            if(displayedMenuEnum == MENU.UTILITYPIXELS.menuId)
            {
                    var startY = 50;
                    var buttonInterScape = 100;
                    var upperBarFontSize = 25;
                    var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                    
                    createPixelsGroupLabel(30,startY+buttonInterScape*0,"Constructors: ", fontStyle, lowerBarMenu, constrPixelsGroup);

            }
        
    
        if(displayedMenuEnum == MENU.BUILDINGS.menuId)
        {
            var startY = 75;
            var buttonInterScape = 75;
            var upperBarFontSize = 30;
            var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
            var i=0;
                createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.STORAGE);
                i++;
            
            if(tech.unlock2Farms)
            {
                createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.SKILLLING);
                i++;
            }
            
            if(tech.unlock4Housing)
            {
                createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.HOUSING);
                i++;
            }
        }
            if(displayedMenuEnum == MENU.STORAGE.menuId)
            {
                var startY = 75;
                var buttonInterScape = 110;
                var upperBarFontSize = 30;
                var descriptionLabelFontSize = 16;
                var fontStyle = { font: descriptionLabelFontSize+"px Arial", fill: "#ffffff", 
                    align: "center", boundsAlignH: "center", boundsAlignV: "bottom", 
                    wordWrap: true, wordWrapWidth: (lowerBarMenu.width-30) };
                    
                var descriptionLabel = createLabel(15, lowerBarMenu.height-10, "", fontStyle, lowerBarMenu);
                descriptionLabel.anchor.y = 1;
                    
                fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                var i=0;
                if(!tech.unlock1Constructors)
                {
                    createBuldingButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, BUILDINGS.STOR_BASE);
                }
                else
                {
                    createBuldingButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, BUILDINGS.STOR_BASIC_EXTEND);
                }
            }
            if(displayedMenuEnum == MENU.SKILLLING.menuId)
            {
                var startY = 50;
                var buttonInterScape = 110;
                var upperBarFontSize = 28;
                    
                fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                var i=0;
                createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.FARMING);
                i++;
                if(tech.unlock3Woodcutting)
                {
                    createButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, MENU.WOODCUTTING);
                    i++;  
                }
            }
                if(displayedMenuEnum == MENU.FARMING.menuId)
                {
                    var startY = 75;
                    var buttonInterScape = 110;
                    var upperBarFontSize = 30;
                    var descriptionLabelFontSize = 16;
                        var fontStyle = { font: descriptionLabelFontSize+"px Arial", fill: "#ffffff", 
                            align: "center", boundsAlignH: "center", boundsAlignV: "bottom", 
                            wordWrap: true, wordWrapWidth: (lowerBarMenu.width-30) };
                            
                        var descriptionLabel = createLabel(15, lowerBarMenu.height-10, "", fontStyle, lowerBarMenu);
                        descriptionLabel.anchor.y = 1;
                        
                        fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                        var i=0;
                        createBuldingButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, BUILDINGS.RES_FARMPATH); 
                        i++;
                }
                if(displayedMenuEnum == MENU.WOODCUTTING.menuId)
                {
                    var startY = 75;
                    var buttonInterScape = 110;
                    var upperBarFontSize = 30;
                    var descriptionLabelFontSize = 16;
                        var fontStyle = { font: descriptionLabelFontSize+"px Arial", fill: "#ffffff", 
                            align: "center", boundsAlignH: "center", boundsAlignV: "bottom", 
                            wordWrap: true, wordWrapWidth: (lowerBarMenu.width-30) };
                            
                        var descriptionLabel = createLabel(15, lowerBarMenu.height-10, "", fontStyle, lowerBarMenu);
                        descriptionLabel.anchor.y = 1;
                        
                        
                        fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                        var i=0;
                        
                        createBuldingButton(30,startY+buttonInterScape*i, fontStyle, lowerBarMenu, BUILDINGS.RES_TREE); 
                        i++;
                }
            if(displayedMenuEnum == MENU.HOUSING.menuId)
            {
                    var startY = 50;
                    var buttonInterScape = 110;
                    var upperBarFontSize = 28;
                    var descriptionLabelFontSize = 16;
                    var fontStyle = { font: descriptionLabelFontSize+"px Arial", fill: "#ffffff", 
                        align: "center",
                        boundsAlignH: "center", 
                        boundsAlignV: "bottom", 
                        wordWrap: true, wordWrapWidth: (lowerBarMenu.width-30)
                    };
                    
                    var descriptionLabel = createLabel(15, lowerBarMenu.height-10, "", fontStyle, lowerBarMenu);
                    descriptionLabel.anchor.y = 1;
                    
                    fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left"};
                    
                    createBuldingButton(30,startY+buttonInterScape*0, fontStyle, lowerBarMenu, BUILDINGS.HOUS_BASIC);
            }

        pauseMenuUpdateing = false;
}

function changeMenu(newMenuId, reload) {
    reload = reload  || false;
    pauseMenuUpdateing = true;    
    lowerBarMenu.fixedToCamera = false;
    var lowerBarMenuTween = game.add.tween(lowerBarMenu).to( {x: (lowerBarMenu.x-300)}, 200, Phaser.Easing.Linear.None, true);
    if((displayedMenuEnum != newMenuId) || reload)  { menuEnumLastPosition =  displayedMenuEnum; }
    else                                { newMenuId = 0; } 
    displayedMenuEnum = newMenuId;
    lowerBarMenuTween.onComplete.addOnce(destroyMenu);
}
function destroyMenu() {
    groupMenuBarsAndBoxes.remove(lowerBarMenu, true);
    createMenu();
}
function createMenu() {
    lowerBarMenu = groupMenuBarsAndBoxes.create(lowerBar.x-300, lowerBar.y-lowerBar.height-400, 'lowerBarMenu');
    lowerBarMenu.inputEnabled = true;
    lowerBarMenu.alpha = 0.5;
    lowerBarMenu.events.onInputOver.add(function()  {    mouseOverAnyMenu = true;   });
    lowerBarMenu.events.onInputOut.add(function()   {    mouseOverAnyMenu = false;  });

    fillMenu();

    if(displayedMenuEnum != 0) 
    { 
        var lowerBarMenuTween = game.add.tween(lowerBarMenu).to( {x: (lowerBar.x)}, 200, Phaser.Easing.Linear.None, true); 
        lowerBarMenuTween.onComplete.addOnce(function() {
                lowerBarMenu.fixedToCamera = true;
                lowerBarMenu.cameraOffset.x = 0;
                lowerBarMenu.cameraOffset.y = h-lowerBar.height-400;
        });
    }
    else 
    {
        lowerBarMenu.fixedToCamera = true;
        lowerBarMenu.cameraOffset.x = -300;
        lowerBarMenu.cameraOffset.y = h-lowerBar.height-400;
    }
    
}

function updateMenu() {
    if(!pauseMenuUpdateing)
    {
        switch(displayedMenuEnum)
        {
            case MENU.WORKERPIXELS.menuId:
                lowerBarMenu.getChildAt(0).text = "Farmers: "           + farmersPixelsGroup.total;
                if(tech.unlock3Woodcutting)
                {
                    lowerBarMenu.getChildAt(1).text = "Woodcutters: "       + woodcuttersPixelsGroup.total;
                    if(techStoneDiscovered) //TO RENAME!
                    { 
                        lowerBarMenu.getChildAt(2).text = "Stonecutters: "  + stonecuttersPixelsGroup.total;
                        if(techMetalDiscovered) //TO RENAME!
                        {
                            lowerBarMenu.getChildAt(3).text = "Miners: "    + minersPixelsGroup.total;
                        }
                    }
                }
                for(var i=0; i < lowerBarMenu.children.length; i++)
                {
                    for(var j=0; j < lowerBarMenu.getChildAt(i).children.length; j++)
                    {
                        if(pixelsGroupsProcedureCheck(lowerBarMenu.getChildAt(i).getChildAt(j).sourceGroup)) { lowerBarMenu.getChildAt(i).getChildAt(j).addColor('#ffffff', 0); }
                        else 
                        { 
                            lowerBarMenu.getChildAt(i).getChildAt(j).addColor('#b8b894', 0); 
                            lowerBarMenu.getChildAt(i).getChildAt(j).strokeThickness = 0;
                            
                        } 
                    }
                }
            break;
        
            case MENU.UTILITYPIXELS.menuId:
                lowerBarMenu.getChildAt(0).text = "Constructors: "           + constrPixelsGroup.total;
    
                for(var i=0; i < lowerBarMenu.children.length; i++)
                {
                    for(var j=0; j < lowerBarMenu.getChildAt(i).children.length; j++)
                    {
                        if(pixelsGroupsProcedureCheck(lowerBarMenu.getChildAt(i).getChildAt(j).sourceGroup)) { lowerBarMenu.getChildAt(i).getChildAt(j).addColor('#ffffff', 0); }
                        else 
                        { 
                            lowerBarMenu.getChildAt(i).getChildAt(j).addColor('#b8b894', 0); 
                            lowerBarMenu.getChildAt(i).getChildAt(j).strokeThickness = 0;
                        } 
                    }
                }
            break;
        
        
            case MENU.STORAGE.menuId: 
            case MENU.HOUSING.menuId:
            case MENU.FARMING.menuId:
            case MENU.WOODCUTTING.menuId:
                for(var i=1; i < lowerBarMenu.children.length; i++)
                {
                    if(resourceCheck(lowerBarMenu.getChildAt(i).buildingEnum)) { lowerBarMenu.getChildAt(i).addColor('#ffffff', 0);}
                    else { lowerBarMenu.getChildAt(i).addColor('#b8b894', 0);} 
                }
            break;
        }
    }
}

function updateLowerBar(create) {
    if(create == null)
    {
        create = false;
    }
    
    if(!create)
    {
        lowerBar.destroy();
    
        lowerBar = groupMenuBarsAndBoxes.create(0, h, 'lowerBar');
    }
    lowerBar.anchor.y = 1;
    var i=0;
    var upperBarFontSize = 24;
    var fontStyle = { font: upperBarFontSize+"px Arial", fill: "#ffffff", align: "left", tabs: [ 250, 250, 250] };
    
        if(tech.unlock1Constructors)
        {
            createButton(40+(200*i),-(lowerBar.height/2)+2, fontStyle, lowerBar, MENU.PIXELS);
            i++;
        }
        createButton(40+(200*i),-(lowerBar.height/2)+2, fontStyle, lowerBar, MENU.BUILDINGS);
        i++;
        
        //other buttons (techTree?)
        
            
        createButton(40+800,-(lowerBar.height/2)+2, fontStyle, lowerBar, MENU.PAUSEMENU);
    
    
    if(!create)
    {    
        lowerBar.inputEnabled = true;
        lowerBar.alpha = 0.5;
        lowerBar.fixedToCamera = true;
            
        lowerBar.events.onInputOver.add( function() {    mouseOverAnyMenu = true;    });
        lowerBar.events.onInputOut.add( function() {    mouseOverAnyMenu = false;    });
    }
}

function updateResourcesLabel(){
    var textFood = "";
    var textWood = "";
    var textStone = "";
    var textMetal = "";
    if(tech.unlock2Farms)
    {
        textFood = "Food: " + Math.floor(resources.food) + "/" + resources.foodCap;
        
        if(tech.unlock3Woodcutting)
        {
            textWood = "Wood: " + Math.floor(resources.wood) + "/" + resources.woodCap;
            
            if(techStoneDiscovered) //TO RENAME!
            { 
                textStone = "Stone: " + Math.floor(resources.stone) + "/" + resources.stoneCap; 
                if(techMetalDiscovered) //TO RENAME!
                {
                    textMetal = "Metal: " + Math.floor(resources.metal) + "/" + resources.metalCap;
                }
            }
        }
    }

    var textResources =  textFood + "\t" + textWood + "\t" + textStone + "\t" + textMetal;
    upperBar.getChildAt(0).text = textResources;
    
    pixelsUpperBar.getChildAt(0).text =  "All Pixels: " +getAllPixels()+"\t Without work: "+ unemployedPixelsGroup.total + "\t Without home: " + (getAllPixels() - resources.homeCap);

    if(resources.food>=resources.foodCap && !resources.foodCapReached) { writeLog("Food cap reached!",1) }
    if(resources.wood>=resources.woodCap && !resources.woodCapReached) { writeLog("Wood cap reached!",1) }
    if(resources.stone>=resources.stoneCap && !resources.stoneCapReached) { writeLog("Stone cap reached!",1) }
    if(resources.metal>=resources.metalCap && !resources.metalCapReached) { writeLog("Metal cap reached!",1) }

    //flags used to prevent from bugging log with messages!
    resources.foodCapReached = false;
    resources.woodCapReached = false;
    resources.stoneCapReached = false;
    resources.metalCapReached = false;
    
    if(resources.food>=resources.foodCap)   { resources.foodCapReached = true; }
    if(resources.wood>=resources.woodCap)   { resources.woodCapReached = true; }
    if(resources.stone>=resources.stoneCap) { resources.stoneCapReached = true; }
    if(resources.metal>=resources.metalCap) { resources.metalCapReached = true; }
}


function drawLog(){
        
    var tempStackToString = "";    
    var tempLoggerObject = logBox.getChildAt(0);
    var lineColor = '#ffffff';
    logBox.getChildAt(0).colors = [];
     for(var i=0; i < 5; i++)
     {
        switch(logLinesType[i])
        {
                //Normal white
                case 0: 
                        lineColor = '#ffffff';
                        break;
                //Red important massage          
                case 1: 
                        lineColor = '#ff0000';
                        break;
                //Blue info-update  
                case 2: 
                        lineColor = '#0066ff';
                        break;
                //Orange warring        
                case 3:       
                        lineColor = '#e68a00';
                        break;
                //Pink crash
                case 4:       
                        lineColor = '#ff99ff';
                        break;
                default:
                        lineColor = '#ffffff';
                        break;
        }
        tempLoggerObject.addColor(lineColor, (tempStackToString.length-(i)) );
        tempStackToString  = tempStackToString + logLinesStack[i] + "\n";
     }
     tempLoggerObject.text = tempStackToString;
        
}
function writeLog(newLine, type){
    
    logLinesType.shift();
    logLinesType.push(type);

    logLinesStack.shift();
    logLinesStack.push(getTimeString()+" "+newLine);
    drawLog();
}