var GameCtrl = {
    static_url: "http://gormangames.com/static/games/elemental_mage/",
    controls : {
        "player1": {
            up:         Phaser.Keyboard.W,
            left:       Phaser.Keyboard.A,
            right:      Phaser.Keyboard.D,
            down:       Phaser.Keyboard.S,
            fireball:   Phaser.Keyboard.R,
            waterball:  Phaser.Keyboard.T,
            airball:    Phaser.Keyboard.Y
        },
        "player2": {
            up:         Phaser.Keyboard.UP,  
            left:       Phaser.Keyboard.LEFT,
            right:      Phaser.Keyboard.RIGHT,
            down:       Phaser.Keyboard.DOWN,
            fireball:   Phaser.Keyboard.B,
            waterball:  Phaser.Keyboard.N,
            airball:    Phaser.Keyboard.M
        }
    }
};
