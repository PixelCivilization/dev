function setBuildMarker() {
    buildMarker.clear();
    buildMarker.lineStyle(3, 0xffffff, 1);
    buildMarker.drawRect(0, 0, 10*buildWidth, 10*buildHeight);
                
                //set rangeMarker
                /*
                buildMarker2.clear();
                buildMarker2.lineStyle(1, 0xffffff, 1);
                buildMarker2.drawRect(0, 0, 10*20, 10*20);
                */
}
function drawBuildMarker(){
    if(!mouseOverAnyMenu && buildingModeEnabled)
    {
        setBuildMarker();
        buildMarker.alpha = 1;
        buildMarker.x = mapLayerGround.getTileX(game.input.activePointer.worldX) * 10;
        buildMarker.y = mapLayerGround.getTileY(game.input.activePointer.worldY) * 10;
        
                //draw rangeMarker
                /*
                buildMarker2.alpha = 1;
                buildMarker2.x = mapLayerGround.getTileX(game.input.activePointer.worldX-100) * 10;
                buildMarker2.y = mapLayerGround.getTileY(game.input.activePointer.worldY-100) * 10;
                */
                
        if(buildingTerrainCheck()) { buildMarker.tint = 0x00ff00; }
        else { buildMarker.tint = 0xff0000; }
    }
    else { buildMarker.alpha = 0; }
}

function setBuildingProgressBar() {
    if(buildingQueue.length > 0)
    {
        buildProgressBar.clear();
        //buildProgressBar.lineStyle(1, 0x000000, 1);
        buildProgressBar.drawRect(buildingQueue[0].x, buildingQueue[0].y, (10*buildingQueue[0].bEnum.width), 4);
        buildProgressBar.beginFill(0xffffff, 1);
        buildProgressBar.drawRect(buildingQueue[0].x, buildingQueue[0].y, (10*buildingQueue[0].bEnum.width), 4);
        buildProgressBar.endFill();
    }
}
function updateBuildingProgressBar() {
    if(buildingQueue.length > 0)
    {
        setBuildingProgressBar();
        buildProgressBar.beginFill(0x00ff00, 1);
        var calcProgress = (buildingQueue[0].bprogress / buildingQueue[0].bEnum.workingSiteUnits) * 10;
        buildProgressBar.drawRect(buildingQueue[0].x, buildingQueue[0].y, (calcProgress*buildingQueue[0].bEnum.width), 4);
        buildProgressBar.endFill();
    }
}

function tryToBuild(){
    if(!mouseOverAnyMenu && buildingModeEnabled)
    {
        if(resourceCheck(buildEnum))
        {
            preBuildCalculation();
        }
        else
        {
            writeLog("Not enough resources to build "+buildEnum.name+"!", 1);
            quitBuildingMode();
        }
    }
}

function resourceCheck(buildingEnum) {
    if(cheats.freeBuildings) {  return true; }
    if(buildingEnum.resToBuild[0] > resources.food) { return false; }
    if(buildingEnum.resToBuild[1] > resources.wood) { return false; }
    if(buildingEnum.resToBuild[2] > resources.stone) { return false; }
    if(buildingEnum.resToBuild[3] > resources.metal) { return false; }
    return true;
}
function quitBuildingMode() {
    buildingModeEnabled = false;
    drawBuildMarker();
    changeMenu(menuEnumLastPosition);
}

function preBuildCalculation() {
    
    resources.food -= buildEnum.resToBuild[0];
    resources.wood -= buildEnum.resToBuild[1];
    resources.stone -= buildEnum.resToBuild[2];
    resources.metal -= buildEnum.resToBuild[3];
    
    switch(buildEnum.id) {
        case BUILDINGS.STOR_BASE.id:

            unlockConstructors();
            updateLowerBar();
            menuEnumLastPosition = 0;
        break;
    }
    
    var building = { x: buildMarker.x, y: buildMarker.y, bEnum: buildEnum, bprogress: 0 };
    buildingQueue.push(building);
    
    map.fill(worksiteTile, mapLayerGround.getTileX(buildMarker.x), mapLayerGround.getTileY(buildMarker.y), buildEnum.width, buildEnum.height);
    
    updateBuildingProgressBar();
    
    if(!(constrPixelsGroup.total > 0))
    {
        writeLog("Constructors are requied to complete building!",3);
    }
    quitBuildingMode();
}

function checkBuildingState() {
    if(buildingQueue[0].bprogress == buildingQueue[0].bEnum.workingSiteUnits)
    {
        writeLog(buildingQueue[0].bEnum.name+" has been builded!",0);
        postBuildCalculation();
        //T0 RETHINK is better to let pixel finish tween, and change just workRoutine?
        game.tweens.removeFrom(constrPixelsGroup, true);
        constrPixelsGroup.forEach(function(tempPix) {
            tempPix.workRoutine = 0;
            tempPix.wanderCount = 0;
            nextPixelTween(tempPix);
        });
    }
}

function postBuildCalculation() {
    switch(buildingQueue[0].bEnum.id) {
            
        case BUILDINGS.STOR_BASE.id:
            resources.foodCap += 10;
            resources.woodCap += 10;
            //T0D0 push array of 4 points
                storageCoor.push(new Phaser.Point(buildingQueue[0].x,   buildingQueue[0].y));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x+10,buildingQueue[0].y));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x,   buildingQueue[0].y+10));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x+10,buildingQueue[0].y+10));

                unlockFarms();
            break;
                
        case BUILDINGS.STOR_BASIC_EXTEND.id:
            resources.foodCap += 20;
            resources.woodCap += 20;
                storageCoor.push(new Phaser.Point(buildingQueue[0].x,   buildingQueue[0].y));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x+10,buildingQueue[0].y));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x,   buildingQueue[0].y+10));
                storageCoor.push(new Phaser.Point(buildingQueue[0].x+10,buildingQueue[0].y+10));
            break;
            
        case BUILDINGS.HOUS_BASIC.id:
            resources.homeCap += 3;
            housingCoor.push(new Phaser.Point(buildingQueue[0].x,buildingQueue[0].y));
            break;
            
    }
    
    buildProgressBar.clear();
                
    map.fill(buildingQueue[0].bEnum.tileId, mapLayerGround.getTileX(buildingQueue[0].x), mapLayerGround.getTileY(buildingQueue[0].y), buildingQueue[0].bEnum.width, buildingQueue[0].bEnum.height);
    buildingQueue.shift();
    updateBuildingProgressBar();
}

function buildingTerrainCheck() {
    var buildCollisionTiles = mapLayerGround.getTiles(buildMarker.x-10, buildMarker.y-10, (buildWidth+2)*10, (buildHeight+2)*10, false);
    var returnState = true;
    if(buildCollisionTiles.length > 0) 
    {  
    //buildingModes: 0- standalone, 1-MustExtendAnyFace, 2-CanExtendAnyFace   
        switch(buildEnum.mode) 
        {
            case 0:
                buildMarker.beginFill(0xffffff, 0.5);
                for(var i=0; i < buildCollisionTiles.length; i++)
                {
                    if(buildCollisionTiles[i].index != 0) 
                    { 
                        returnState = false;
                        buildMarker.lineStyle(1, 0xffffff, 0.5);
                        buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                    }
                }
                buildMarker.endFill();
                break;
            case 1:
                buildMarker.beginFill(0xffffff, 0.5);
                
                //groundOfBuilding
                for(var k=1; k<buildHeight+1; k++)
                {
                    for(var l=1; l<buildWidth+1; l++)
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != 0) 
                        { 
                            returnState = false;
                            buildMarker.lineStyle(1, 0xffffff, 0.5);
                            buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                        } 
                    }
                }
                
                //EastWeastFaceOfBuilding
                var isExtendingWestSide = true;
                var isExtendingEastSide = true;
                for(var k=1; k<buildHeight+1; k++) 
                {
                    for(var l=0; l < (buildWidth+2); l = l+(buildWidth+1))
                    {
                        var i = (k*(buildWidth+2))+l;
                        
                        if(buildCollisionTiles[i].index != buildEnum.tileId)
                        {
                            if(buildCollisionTiles[i].index != 0) 
                            {
                                returnState = false;
                                buildMarker.lineStyle(1, 0xffffff, 0.5);
                                buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                            }
                            else
                            {
                                if(l == 0) 
                                {
                                    isExtendingWestSide = false; 
                                }
                                else
                                {
                                    isExtendingEastSide = false; 
                                }
                            }
                        }
                    } 
                }
                        
                //NorthsouthFaceOfBuilding
                var isExtendingNorthSide = true;
                var isExtendingSouthSide = true;
                for(var k=0; k < (buildHeight+2); k = k+(buildHeight+1))
                {
                    for(var l=1; l<buildWidth+1; l++)
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != buildEnum.tileId)
                        {
                            if(buildCollisionTiles[i].index != 0) 
                            {
                                returnState = false;
                                buildMarker.lineStyle(1, 0xffffff, 0.5);
                                buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                            }
                            else
                            {
                                if(k == 0) 
                                {
                                    isExtendingNorthSide = false; 
                                }
                                else
                                {
                                    isExtendingSouthSide = false; 
                                }
                            }
                        }
                    } 
                }
                
                //CornersOfArea
                for(var k=0; k < (buildHeight+2); k = k+(buildHeight+1))
                {
                    for(var l=0; l < (buildWidth+2); l = l+(buildWidth+1))
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != 0 && buildCollisionTiles[i].index != buildEnum.tileId) 
                        {
                            returnState = false;
                            buildMarker.lineStyle(1, 0xffffff, 0.5);
                            buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                        }
                    }
                }
                
                buildMarker.endFill();
                returnState = returnState && (isExtendingNorthSide || isExtendingSouthSide || isExtendingWestSide || isExtendingEastSide);
                break;
            case 2:
                buildMarker.beginFill(0xffffff, 0.5);
                
                //groundOfBuilding
                for(var k=1; k<buildHeight+1; k++)
                {
                    for(var l=1; l<buildWidth+1; l++)
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != 0) 
                        { 
                            returnState = false;
                            buildMarker.lineStyle(1, 0xffffff, 0.5);
                            buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                        } 
                    }
                }
                
                //EastWeastFaceOfBuilding
                for(var k=1; k<buildHeight+1; k++) 
                {
                    for(var l=0; l < (buildWidth+2); l = l+(buildWidth+1))
                    {
                        var i = (k*(buildWidth+2))+l;
                        
                        if(buildCollisionTiles[i].index != buildEnum.tileId)
                        {
                            if(buildCollisionTiles[i].index != 0) 
                            {
                                returnState = false;
                                buildMarker.lineStyle(1, 0xffffff, 0.5);
                                buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                            }
                        }
                    } 
                }
                        
                //NorthsouthFaceOfBuilding
                for(var k=0; k < (buildHeight+2); k = k+(buildHeight+1))
                {
                    for(var l=1; l<buildWidth+1; l++)
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != buildEnum.tileId)
                        {
                            if(buildCollisionTiles[i].index != 0) 
                            {
                                returnState = false;
                                buildMarker.lineStyle(1, 0xffffff, 0.5);
                                buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                            }
                        }
                    } 
                }
                
                //CornersOfArea
                for(var k=0; k < (buildHeight+2); k = k+(buildHeight+1))
                {
                    for(var l=0; l < (buildWidth+2); l = l+(buildWidth+1))
                    {
                        var i = (k*(buildWidth+2))+l;
                        if(buildCollisionTiles[i].index != 0 && buildCollisionTiles[i].index != buildEnum.tileId) 
                        {
                            returnState = false;
                            buildMarker.lineStyle(1, 0xffffff, 0.5);
                            buildMarker.drawRect(buildCollisionTiles[i].worldX-buildMarker.x, buildCollisionTiles[i].worldY-buildMarker.y, 10, 10);
                        }
                    }
                }
                
                buildMarker.endFill();
                break;
        }
        return returnState;
    }
    else 
    { 
        returnState = false;
//console.log("Error while checking terrain!");
        return returnState; 
    }
}

function scanForTile(sourceX,sourceY,desiredTileId) {
    
    for(var distance = 1; distance < 20; distance++)
    {
        var buildCollisionTiles = mapLayerGround.getTiles(sourceX-(10*distance), sourceY-(10*distance), ((distance*2)+1)*10, ((distance*2)+1)*10, false);
    
        if(buildCollisionTiles.length > 0) 
        {  
            //T0D0 speed up scaner
            for(var i=0; i < buildCollisionTiles.length; i++)
            {
                if(buildCollisionTiles[i].index == desiredTileId) 
                { 
                        return buildCollisionTiles[i];
                }
                
            }
    
        }
        else 
        { 
//console.log("Scaner error - no tiles geted");
        }
    }
    return null;
}

function checkResourceTile(tempPix,resourceEnum) {
    var checkedTile = mapLayerGround.getTiles(tempPix.x, tempPix.y, 1, 1);
    if(checkedTile.length == 1)
    {
        if(checkedTile[0].index == resourceEnum.tileId)
        {
            var resourceArrayMatchingIndex = getIndexFromResourcesArray(checkedTile[0]);
            
            if(resourceArrayMatchingIndex == -1)
            {
                var tempObj = { x: checkedTile[0].x, y: checkedTile[0].y, cond: resourceEnum.cond, maxCond: resourceEnum.cond};
                resourceArrayMatchingIndex = resourcePositionAndCondition.push(tempObj) - 1;
            }
            
            if(resourcePositionAndCondition[resourceArrayMatchingIndex].cond <= 0)
            {
                destroyResource(resourceArrayMatchingIndex, resourcePositionAndCondition[resourceArrayMatchingIndex]);
                return false;
            }
            else
            {
                resourcePositionAndCondition[resourceArrayMatchingIndex].cond -= 1;
                if(resourcePositionAndCondition[resourceArrayMatchingIndex].cond <= 0) { destroyResource(resourceArrayMatchingIndex, resourcePositionAndCondition[resourceArrayMatchingIndex]); }
                resourceCondBar.clear();
                resourcePositionAndCondition.forEach(drawResourceBar);
                return true;
            }
        }
        else 
        {
//console.log("Tile index error under "+tempPix.name+"  "+checkedTile[0].index+"!="+resourceEnum.tileId);
            return false;
        }
    }
    else 
    {  
//console.log("Error while getting tile to check");
        return false;
    }
}

function getIndexFromResourcesArray(checkedTile) {
    
    for(var i=0; i<resourcePositionAndCondition.length ;i++)
    {
        if(resourcePositionAndCondition[i].x == checkedTile.x && resourcePositionAndCondition[i].y == checkedTile.y)
        {
            return i;
        }
    }
    return -1;
}

function destroyResource(index, tile) {
    var destroyTileIndex = 0;
    
    map.fill(destroyTileIndex, tile.x, tile.y, 1, 1);
    
    resourcePositionAndCondition.splice(index, 1);
//console.log("Resource: ("+tile.x*10+","+tile.y*10+") has been destroyed.");
}

function drawResourceBar(item, index) {
        resourceCondBar.beginFill(0xff0000, 1);
        var calcProgress = (item.cond / item.maxCond) * 10;
        resourceCondBar.drawRect(item.x*10, (item.y*10)+8, calcProgress, 2);
        resourceCondBar.endFill();
}


function getClosetsFrom(targetsPointsArray, sourcePoint) {
    // body...
}

function drawBuildingRange(argument) {
    // body...
}