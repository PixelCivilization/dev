var techMetalDiscovered = false;
var techStoneDiscovered = false;

var tech = 
{
    unlock1Constructors:        false,
    unlock2Farms:               false,
    unlock3Woodcutting:         false,
    unlock4Housing:             false,
    unlock5StorageExtension:    false
};


function unlockConstructors() {
    tech.unlock1Constructors = true;
    writeLog("Constructors have been discovered!",2);
    
}


function unlockFarms() {
    tech.unlock2Farms = true;
    writeLog("Farms have been discovered!",2);
    //T0D0update menu if opened on Pixels
}


function unlockWoodcutting() {
    tech.unlock3Woodcutting = true;
    writeLog("Woodcutting have been discovered!",2);
    //T0D0update menu if opened on Pixels->Workers OR Buildings->Skilling IMPORTANT IMPACT ON updateMenu()
}

function unlockHousing() {
    tech.unlock4Housing = true;
    writeLog("Housing have been discovered!",2);
    //T0D0update menu if opened on Buildings IMPORTANT IMPACT ON updateMenu()
}