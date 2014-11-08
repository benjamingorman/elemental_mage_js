GameCtrl.MainMenu = function() {
};

GameCtrl.MainMenu.prototype = {
    create: function() {
        game.add.sprite(0,0, 'bridge_and_sky'); 

        var title_image = game.add.sprite(game.world.width * 0.5, 100, 'title_image');
        title_image.anchor.setTo(0.5, 0.5);

        //args: x, y, spritesheet name, callback on click, callback context, frame when hovering, frame when off
        var play_button = game.add.button(
            game.world.width * 0.5,
            300,
            'menu_buttons',
            function() {game.state.start('Play')},
            this,
            7,
            6
        );
        play_button.anchor.setTo(0.5, 0.5);

        var instructions_button = game.add.button(
            game.world.width * 0.5,
            400,
            'menu_buttons',
            function() {game.state.start('Instructions')},
            this,
            5,
            4
        );
        instructions_button.anchor.setTo(0.5, 0.5);

        var about_button = game.add.button(
            game.world.width * 0.5,
            500,
            'menu_buttons',
            function() {game.state.start('About')},
            this,
            3,
            2
        );
        about_button.anchor.setTo(0.5, 0.5);
    }
};

