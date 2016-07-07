var MENU = {
        PIXELS                  : {menuId: 1,  text: "Pixels"},
                WORKERPIXELS    : {menuId: 10, text: "Workers pixels"},
                UTILITYPIXELS   : {menuId: 11, text: "Utility pixels"},
                MILITARYPIXELS  : {menuId: 12, text: "Military pixels"},
        BUILDINGS               : {menuId: 2,  text: "Buildings"},
                STORAGE         : {menuId: 21, text: "Storage"},
                SKILLLING       : {menuId: 22, text: "Skilling"},
                    FARMING     : {menuId: 220, text: "Farming"},
                    WOODCUTTING : {menuId: 221, text: "Woodcutting"},
                HOUSING         : {menuId: 23, text: "Housing"},
                MILITARY        : {menuId: 24, text: "Military"},
                
        PAUSEMENU               : {menuId: 5,  text: "Menu"}
};


//buildingModes: 0- standalone, 1-MustExtendAnyFace, 2-CanExtendAnyFace  
var BUILDINGS = {
        RES_TREE            : {category: 1, id: 1, width: 1, height: 1, tileId: 1,  mode: 2, workingSiteUnits: 10, name: "Plant forest",  resToBuild: [2,0,0,0],     describe: "Planted forest allow your woodcutters to gather 20 units of wood before used." , cond: 20 },
        RES_FARMPATH        : {category: 1, id: 2, width: 1, height: 3, tileId: 3,  mode: 2, workingSiteUnits: 8,  name: "Farming path",  resToBuild: [3,0,0,0],     describe: "Farming path (3 tiles) allow your farmers to gather 10 units of food each before used." , cond: 10 },
        RES_STONESITE       : {category: 1, id: 3, width: 2, height: 2, tileId: 5,  mode: 0, workingSiteUnits: 50, name: "Stone site",    resToBuild: [3,10,0,0],    describe: "" , cond: 50 },
        
        STOR_BASE           : {category: 2, id: 4, width: 2, height: 2, tileId: 9,  mode: 0, workingSiteUnits: 5, name: "Base storage",       resToBuild: [0,0,0,0],     describe: "Chose place where you want start building village and set base storage!"  },
        STOR_BASIC_EXTEND   : {category: 2, id: 5, width: 2, height: 2, tileId: 9,  mode: 1, workingSiteUnits: 20, name: "Storage extension", resToBuild: [7,7,0,0],     describe: "Storage extension must algin to base storage! Increse capacity of stored food and wood by 10 units both."  },
        
        HOUS_BASIC          : {category: 3, id: 6, width: 1, height: 1, tileId: 10, mode: 0, workingSiteUnits: 15, name: "Basic hut",       resToBuild: [5,5,0,0],     describe: "Basic hut for 3 pixels to live in."  },

};

