var game = new Phaser.Game(1280, 800, Phaser.AUTO, 'game_frame');

var $ground_y;
var $ground;
var $clouds;
var $backgroundHouse;
var $platforms;
var $players;
var $projectiles;
var $gameOver;

game.state.add('Preloader', GameCtrl.Preloader);
game.state.add('MainMenu', GameCtrl.MainMenu);
game.state.add('Instructions', GameCtrl.Instructions);
game.state.add('About', GameCtrl.About);
game.state.add('Play', GameCtrl.Play);

game.state.start('Preloader');
