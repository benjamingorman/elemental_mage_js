GameCtrl.About = function() {
};

GameCtrl.About.prototype = {
    create: function() {
        game.add.sprite(0, 0, "about_sheet");
        var back_button = game.add.button(
            game.world.width * 0.75,
            game.world.height * 0.85,
            'menu_buttons',
            function() {game.state.start('MainMenu')},
            this,
            1,
            0
        ).anchor.setTo(0.5, 0.5);
    }
};    
