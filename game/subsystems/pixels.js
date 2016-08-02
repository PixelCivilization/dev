var outOfForests = false;
var outOfFarms = false;

function getAllPixels(){
    var result = unemployedPixelsGroup.total + 
                farmersPixelsGroup.total + woodcuttersPixelsGroup.total + stonecuttersPixelsGroup.total + minersPixelsGroup.total +
                constrPixelsGroup.total ;
    
    return result;
}
function pixelsGroupsProcedureCheck(checkGroup) {
       if(checkGroup.total > 0) { return true; }
       else { return false; }
}

function pixelsSpawner() {
    //spawn new Pixel if new house created or 10% of homeCap
    if(getAllPixels() < resources.homeCap || (getAllPixels() - resources.homeCap) < resources.homeCap*0.1)
    {
        stats.pixelsSpawned++;
        var tempPixel = createPixel();
        writeLog(tempPixel.name + " has appear!");
    }
}
function createPixel() {
    var spawnPoint = new Phaser.Point(520,370);
    if(housingCoor.length > 0) { spawnPoint = game.rnd.pick(housingCoor); }
    
    
    var tempPixel = unemployedPixelsGroup.create(spawnPoint.x-10+game.rnd.integerInRange(1,28), spawnPoint.y+10, 'blkPix');
        tempPixel.id = stats.pixelsSpawned;
        tempPixel.name = 'Pixel#' + stats.pixelsSpawned;
        tempPixel.workRoutine = 0;
        tempPixel.wanderCount = 0;
        tempPixel.capWasFull = false;
    nextPixelTween(tempPixel);
    return tempPixel;
}

function nextPixelTween(tempPix) {
    //This method is soft looped for each Pixel
    
    
    //T0D0 rewrite on switch
    if(tempPix.parent == unemployedPixelsGroup)
    {
        if(Math.random() < 0.1 && housingCoor.length > 0)
        {
//console.log(tempPix.name+" is going to random house (0 (10%))");
            var goToNewHouseDestinationPoint = game.rnd.pick(housingCoor);
            var destinationPoint = new Phaser.Point(goToNewHouseDestinationPoint.x-10 + game.rnd.integerInRange(1,28), 
                                                    goToNewHouseDestinationPoint.y+10);
            
            setGoTween(tempPix, destinationPoint);
        }
        else 
        {
//console.log(tempPix.name+" is wandering around (0 (90%))");
            wanderAroundTween(tempPix, true);
        }
    }
    
    if(tempPix.parent == constrPixelsGroup)
    {
        if(buildingQueue.length > 0)
        {
        switch(tempPix.workRoutine) {
            case 0:
                    
//console.log(tempPix.name+" is going to random storage (0)");
                
                var goToNewStorageDestinationPoint = game.rnd.pick(storageCoor);
                if(goToNewStorageDestinationPoint == null)
                {
                    //This will occur only at start game
                    console.log(tempPix.name + " can't find storage!");
                    tempPix.workRoutine = 2;
                    wanderAroundTween(tempPix);
                    break;
                }
                
                var destinationPoint = new Phaser.Point(goToNewStorageDestinationPoint.x + game.rnd.integerInRange(1,8), 
                                                        goToNewStorageDestinationPoint.y + game.rnd.integerInRange(1,8));
                
                setGoTween(tempPix, destinationPoint);
                    
                nextWorkRoutine(tempPix);
                
                tempPix.wanderCount = 0;
                tempPix.wanderTarget = game.rnd.integerInRange(3,4);
                    break;
            case 1:   
//console.log(tempPix.name+" is wandering around (1) [count:"+tempPix.wanderCount+"/"+tempPix.wanderTarget);
                wanderAroundTween(tempPix);
                    break;
            case 2:
//console.log(tempPix.name+" is going to workingsite (2)");
                var destinationPoint = new Phaser.Point(buildingQueue[0].x + game.rnd.integerInRange(1,(buildingQueue[0].bEnum.width*10)-2), 
                                                        buildingQueue[0].y + game.rnd.integerInRange(1,(buildingQueue[0].bEnum.height*10)-2) );
                
                setGoTween(tempPix, destinationPoint);
    
                nextWorkRoutine(tempPix);
                
                tempPix.wanderCount = 0;
                tempPix.wanderTarget = game.rnd.integerInRange(6,8);
                    break;
                case 3:
//console.log(tempPix.name+" is wandering around (3) [count:"+tempPix.wanderCount+"/"+tempPix.wanderTarget);
                    wanderAroundTween(tempPix);
                        break;
            }
        }
        else 
        {
            if(Math.random() < 0.2 && storageCoor.length > 0)
            {
//console.log(tempPix.name+ " is going to random storage (0 (20%))");
                var goToNewDestinationPoint = game.rnd.pick(storageCoor);
                var destinationPoint = new Phaser.Point(goToNewDestinationPoint.x + game.rnd.integerInRange(1,8), 
                                                        goToNewDestinationPoint.y + game.rnd.integerInRange(1,8));

                setGoTween(tempPix, destinationPoint);
            }
            else 
            {
//console.log(tempPix.name+" is wandering around (0 (80%))");
                wanderAroundTween(tempPix,true);
            }
        }
    }
    
    if(tempPix.parent == farmersPixelsGroup)
    {
    switch(tempPix.workRoutine) {
        case 0:
//console.log(tempPix.name + " is going to random storage (0)");
            //var goToNewStorageDestinationPoint = game.rnd.pick(storageCoor);
            
//console.log(tempPix.name + " is going to closest storage (0)");
            var goToNewStorageDestinationPoint = getClosetsFrom(storageCoor, tempPix.position);
            
            var destinationPoint = new Phaser.Point(goToNewStorageDestinationPoint.x + game.rnd.integerInRange(1,8), 
                                                    goToNewStorageDestinationPoint.y + game.rnd.integerInRange(1,8));

            setGoTween(tempPix, destinationPoint);
                    
            nextWorkRoutine(tempPix);
                
            tempPix.wanderCount = 0;
            tempPix.wanderTarget = game.rnd.integerInRange(4,5);
                break;
        case 1:   
//console.log(tempPix.name + " is wandering around (1)");
            wanderAroundTween(tempPix);
                break;
        case 2:
//console.log(tempPix.name + " is going to nearest farm (2)");

            var goToTile = scanForTile(tempPix.x, tempPix.y, BUILDINGS.RES_FARMPATH.tileId);
            
            if(goToTile == null)
            {
                if(!outOfFarms)
                {
                    writeLog("No farms detected!",1);
                    outOfFarms = true;
                }
                wanderAroundTween(tempPix);
                break;
            }
            outOfFarms = false;
            
            var destinationPoint = new Phaser.Point((goToTile.x*10)+game.rnd.integerInRange(1,8), 
                                                    (goToTile.y*10)+game.rnd.integerInRange(1,8));
            
            setGoTween(tempPix, destinationPoint);

            nextWorkRoutine(tempPix);
                
            tempPix.wanderCount = 0;
            tempPix.wanderTarget = game.rnd.integerInRange(7,8);
                break;
            case 3:
//console.log(tempPix.name + " is wandering around (3)");
                wanderAroundTween(tempPix);
                    break;
        }
    }
    
    if(tempPix.parent == woodcuttersPixelsGroup)
    {
    switch(tempPix.workRoutine) {
        case 0:
//console.log(tempPix.name + " is going to random storage (0)");
            //var goToNewStorageDestinationPoint = game.rnd.pick(storageCoor);
            
//console.log(tempPix.name + " is going to closest storage (0)");
            var goToNewStorageDestinationPoint = getClosetsFrom(storageCoor, tempPix.position);
        
            var destinationPoint = new Phaser.Point((goToNewStorageDestinationPoint.x + game.rnd.integerInRange(1,8)), 
                                                    (goToNewStorageDestinationPoint.y + game.rnd.integerInRange(1,8)));
                
            setGoTween(tempPix, destinationPoint);
                    
            nextWorkRoutine(tempPix);
                
            tempPix.wanderCount = 0;
            tempPix.wanderTarget = game.rnd.integerInRange(4,5);
            break;
                
        case 1:   
//console.log(tempPix.name + " is wandering around (1)");
            wanderAroundTween(tempPix);
            break;
                
        case 2:
//console.log(tempPix.name + " is going to nearest forest (2)");
            var goToTile = scanForTile(tempPix.x, tempPix.y, BUILDINGS.RES_TREE.tileId);
            
            if(goToTile == null)
            {
                if(!outOfForests)
                {
                    writeLog("No forests detected!",1);
                    outOfForests = true;
                }
                wanderAroundTween(tempPix);
                break;
            }
            outOfForests = false;
            
            
            var destinationPoint = new Phaser.Point(((goToTile.x)*10) + game.rnd.integerInRange(1,8), 
                                                    ((goToTile.y)*10) + game.rnd.integerInRange(1,8) );

            setGoTween(tempPix, destinationPoint);

            nextWorkRoutine(tempPix);
                
            tempPix.wanderCount = 0;
            tempPix.wanderTarget = game.rnd.integerInRange(7,8);
            break;
            
        case 3:
//console.log(tempPix.name + " is wandering around (3)");
            wanderAroundTween(tempPix);
            break;
        }
    }
    

}

//BACKPACK MAPPING [0] - resource (0-food,1-wood,2-stone,3-metal), [1] - amount
//nextWorkRoutine stepNextWorkRoutine + calculations ~!NOT CALL MOVING FUNCTIONS!~
function nextWorkRoutine(tempPix) {
    tempPix.workRoutine += 1;

    //T0D0 rewrite on switch        
        if(tempPix.parent == constrPixelsGroup)
        {
            if(tempPix.workRoutine >= 4) 
            { 
                tempPix.workRoutine = 0; 
            }
        }
        if(tempPix.parent == woodcuttersPixelsGroup)
        {
            if(tempPix.workRoutine == 2 && tempPix.backpack != null) 
            { 
                emptyBackpack(tempPix);
            }
            if(tempPix.workRoutine >= 4) 
            { 
                if(checkResourceTile(tempPix, BUILDINGS.RES_TREE))
                {
                    tempPix.workRoutine = 0; 
                    tempPix.backpack = [1, 1];
                }
                else
                {
                    tempPix.workRoutine = 2; 
                }
            }
        }
        if(tempPix.parent == farmersPixelsGroup)
        {
            if(tempPix.workRoutine == 2 && tempPix.backpack != null) 
            { 
                emptyBackpack(tempPix);
            }
            if(tempPix.workRoutine >= 4) 
            { 
                if(checkResourceTile(tempPix, BUILDINGS.RES_FARMPATH))
                {
                    tempPix.workRoutine = 0; 
                    tempPix.backpack = [0, 1];
                }
                else
                {
                    tempPix.workRoutine = 2; 
                }
                
            }
        }
}

function wanderAroundTween(tempPix, noCalculation) {
        noCalculation = noCalculation || false;
        
        var destinationPoint = new Phaser.Point( (mapLayerGround.getTileX(tempPix.x)*10)+game.rnd.between(1,8), (mapLayerGround.getTileY(tempPix.y)*10)+game.rnd.between(1,8));
        
        setGoTween(tempPix, destinationPoint);
        
        if(!noCalculation)
        {
            if(tempPix.capWasFull || tempPix.wanderCount >= tempPix.wanderTarget)
            {
                nextWorkRoutine(tempPix);
            }
            
    
            if(tempPix.parent == constrPixelsGroup && tempPix.workRoutine == 3 && tempPix.wanderCount > 0)
            {
                buildingQueue[0].bprogress += 1;
                updateBuildingProgressBar();
                checkBuildingState();
            }
            
            tempPix.wanderCount += 1;
        }
}
function setGoTween(tempPix, destinationPoint) {
    var destinationLongitude = calcDistance(destinationPoint, tempPix.position);
    var waitTime = game.rnd.integerInRange(800,1200);
    var pixTween = game.add.tween(tempPix).to({ x: destinationPoint.x, y: destinationPoint.y },  
                                                            destinationLongitude*pixelWalkTimePerPixel, Phaser.Easing.Linear.None, true, waitTime, 0, false);
    pixTween.onComplete.add(nextPixelTween, this, tempPix);
}

function emptyBackpack(tempPix) {
    switch(tempPix.backpack[0]) {
        case 0:
            if(resources.foodCapReached)
            {  
                tempPix.workRoutine -= 1;
                tempPix.capWasFull = true;
            }
            else 
            { 
                resources.food += tempPix.backpack[1]; 
                tempPix.backpack = null;
                tempPix.capWasFull = false;
                    //T0D0 create method
                    if(!tech.unlock3Woodcutting)
                    {
                        unlockWoodcutting();
                    }
            }
            break;
        case 1:
            if(resources.woodCapReached)
            {
                tempPix.workRoutine -= 1;
                tempPix.capWasFull = true;
            }
            else 
            { 
                resources.wood += tempPix.backpack[1]; 
                tempPix.backpack = null;
                tempPix.capWasFull = false;
                    //T0D0 create method
                    if(!tech.unlock4Housing)
                    {
                        unlockHousing();
                    }
            }
            break;
        case 2:
            if(stoneCapReached)
            {
                tempPix.workRoutine -= 1;
                tempPix.capWasFull = true;
            }
            else 
            { 
                stone += tempPix.backpack[1]; 
                tempPix.backpack = null;
                tempPix.capWasFull = false;
            }
            break;
        case 3:
            if(metalCapReached)
            {
                tempPix.workRoutine -= 1;
                tempPix.capWasFull = true;
            }
            else 
            { 
                metal += tempPix.backpack[1]; 
                tempPix.backpack = null;
                tempPix.capWasFull = false;
            }
            break;
        default:
            writeLog("Undefined backpack containing",4);
            break;
    } 
}

function calcDistance(firstPoint, secondPoint) {
    return Math.round(Math.sqrt(Math.pow(Math.abs(firstPoint.x - secondPoint.x),2)+Math.pow(Math.abs(firstPoint.y - secondPoint.y),2)));
}