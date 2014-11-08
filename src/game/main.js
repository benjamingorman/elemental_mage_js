var game = new Phaser.Game(1280, 800, Phaser.AUTO, 'game_frame');
GameCtrl = {};

game.state.add('Preloader', GameCtrl.Preloader);
game.state.add('MainMenu', GameCtrl.MainMenu);
game.state.add('Prestage', GameCtrl.Prestage);
game.state.add('Stage01', GameCtrl.Stage01);
game.state.add('Stage02', GameCtrl.Stage02);

game.state.start('Preloader');
