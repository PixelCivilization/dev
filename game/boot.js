var bootState = {
    preload: function(){
        game.load.image('loading',"assets/loading.png");  
    },
    create: function(){
        document.body.oncontextmenu = function() { return false; };
        
        game.stage.disableVisibilityChange = true;
        
        Phaser.Canvas.setUserSelect(game.canvas, 'none');
        Phaser.Canvas.setTouchAction(game.canvas, 'none');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};