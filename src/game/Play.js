GameCtrl.Play = function() {
};

GameCtrl.Play.prototype = {
    create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // display background image
    game.add.sprite(0, 0, 'bridge_and_sky');
    // configure $ground
    $ground_y = game.world.height - 156;
    $ground = game.add.sprite(0, $ground_y);
    game.physics.arcade.enable($ground);
    $ground.body.immovable = true;
    $ground.body.width = game.world.width;
    $ground.body.height = 10;
    // configure $platforms
    $platforms = game.add.group();
    $platforms.enableBody = true;
    $platforms.create(210, $ground_y - 165, 'platform');
    $platforms.create(640, $ground_y - 315, 'platform');
    $platforms.create(1070, $ground_y - 165, 'platform');
    $platforms.setAll("body.immovable", true);
    $platforms.forEach(function(p) {
        p.anchor.setTo(0.5,1);
        p.body.checkCollision.left  = false;
        p.body.checkCollision.right = false;
        p.body.checkCollision.down  = false;
    });

    //configure $clouds
    $clouds = game.add.group();
    $clouds.enableBody = true;

    //configure background house smoke
    $backgroundHouse = game.add.emitter(734, 413);
    $backgroundHouse.makeParticles("particle_smoke");
    $backgroundHouse.setYSpeed(-80, -90);
    $backgroundHouse.gravity = 0;
    $backgroundHouse.setXSpeed(50, 60);
    $backgroundHouse.setAlpha(1, 0, 3500);

    //configure $players
    $players = game.add.group();
    $players.enableBody = true;

    var p = $players.create(game.world.width * 0.2, $ground_y - 100, 'player1_spritesheet');
    p.name = "player1";
    p = $players.create(game.world.width * 0.8, $ground_y - 100, 'player2_spritesheet');
    p.name = "player2";
    game.physics.arcade.enable($players);

    //configure $projectiles
    $projectiles = game.add.group();
    $projectiles.enableBody = true;
    $projectiles.autoCull   = true;
    game.physics.arcade.enable($projectiles);

    $players.forEach(function(p) {
        p.body.bounce.y = 0.2;
        p.body.gravity.y = 800;
        p.body.collideWorldBounds = true;
        p.anchor.setTo(0.5,0);
        
        //configure player staff spark emitter
        //staff positions are relative to the animation being played and will be changed accordingly
        //they are used to update the position of charging projectiles as well as sparks coming from the staff
        p.staff = {};
        p.staff.x = p.body.x;
        p.staff.y = p.body.y;
        p.staff.particleEmitter = game.add.emitter(p.staff.x, p.staff.y);
        p.staff.particleEmitter.makeParticles("particle_spark");
        p.staff.particleEmitter.setXSpeed(-20,20);
        p.staff.particleEmitter.setYSpeed(-40,0);
        //explode?, lifespan, frequency
        p.staff.particleEmitter.start(false, 600, 200);
        p.projectile = {
            exists: false,
            charging: false
        };

        p.createProjectile = function(spritesheet_name, projectile_type) {
            this.projectile          = $projectiles.create(p.staff.x, p.staff.y, spritesheet_name);
            this.projectile.type     = projectile_type;
            this.projectile.charging = true;
            this.projectile.animations.add('charging', null, 5, true);
            this.projectile.animations.play('charging');
            this.projectile.power = 0;
            this.projectile.owner = p;

            var emitter = game.add.emitter(p.staff.x, p.staff.y);
            emitter.makeParticles("particle_".concat(projectile_type));
            emitter.setXSpeed(-40,40);
            emitter.setYSpeed(-60,0);
            //explode?, lifespan, frequency
            emitter.start(false, 1000, 80);
            emitter.setAlpha(1,0,3000);
            this.projectile.particleEmitter = emitter;

            this.projectile.anchor.setTo(0.5, 0.5);
            this.projectile.allowGravity = false;
            this.projectile.charge = function () {
                if (this.power < 100) {
                    this.power ++;
                    this.scale.x *= 1.01;
                    this.scale.y *= 1.01;
                } 
            };

            if (this.hasPowerShot) {
                this.projectile.power   = 100;
                this.projectile.scale.x = 2.7;
                this.projectile.scale.y = 2.7;
                this.hasPowerShot = false;
                this.powerShotIcon.kill();
            }
        };

        //power shot control
        p.hasPowerShot = false;
        p.givePowerShot = function() {
            this.hasPowerShot = true;
            var icon = game.add.sprite(this.body.x, this.body.y - 80, 'power_shot_spritesheet');
            game.physics.arcade.enable(icon);

            icon.enableBody = true;
            icon.allowGravity = false;

            icon.animations.add('orbit', null, 30, true);
            icon.animations.play('orbit');
            icon.anchor.setTo(0.5, 0.5);

            icon.body.allowRotation = true;
            icon.body.angularVelocity = 130;
            this.powerShotIcon = icon;
        };

        var name = p.name;
        //controls
        p.controls = {};
        p.controls.up         = game.input.keyboard.addKey(GameCtrl.controls[name].up);
        p.controls.left       = game.input.keyboard.addKey(GameCtrl.controls[name].left);
        p.controls.right      = game.input.keyboard.addKey(GameCtrl.controls[name].right);
        p.controls.down       = game.input.keyboard.addKey(GameCtrl.controls[name].down);
        p.controls.fireball   = game.input.keyboard.addKey(GameCtrl.controls[name].fireball);
        p.controls.waterball  = game.input.keyboard.addKey(GameCtrl.controls[name].waterball);
        p.controls.airball    = game.input.keyboard.addKey(GameCtrl.controls[name].airball);

        p.controls.justPressedProjectileKey = function() { 
            return (
                this.fireball.isDown  && this.fireball.repeats  === 0 ||
                this.waterball.isDown && this.waterball.repeats === 0 ||
                this.airball.isDown   && this.airball.repeats   === 0
            );
        };

        //used to limit firing rate of projectiles
        p.coolingDown = false;

        //UI
        var initial_ui_x;
        var player_icon_name;
        if (p.name === "player1") {
            player_icon_name = "player1_icon";
            initial_ui_x = 35;
        }
        else {
            player_icon_name = "player2_icon";
            initial_ui_x = 1050;
        }
        //player icon
        var player_head = game.add.sprite(initial_ui_x, 50, player_icon_name);
        player_head.anchor.setTo(0.5, 0.6);
            
        //player health and hearts
        p.health = 20;
        p.hearts = game.add.group();

        for (i=0; i<5; i++) {
           var heart =  p.hearts.create(initial_ui_x + 45 + 35*i, 30, 'heart_full');
           heart.value = 4;
           heart.setValue = function(value) {
               this.value = value;

               switch(value) {
                    case 0:
                       this.loadTexture('heart_empty');
                       break;
                    case 1:
                       this.loadTexture('heart_one_quarter');
                       break;
                    case 2:
                       this.loadTexture('heart_half');
                       break;
                    case 3:
                       this.loadTexture('heart_three_quarters');
                       break;
                    case 4:
                       this.loadTexture('heart_full');
                       break;
               }
           };
        }

        p.hearts.refresh = function (new_health) {
            this.forEach(function(heart) {
                if (new_health > 4) {
                    heart.setValue(4);
                    new_health -= 4;
                }
                else if (new_health <= 0) {
                    heart.setValue(0);
                }
                else {
                    heart.setValue(new_health);
                    new_health = 0;
                }
            });
        };
        //this should be the interface to changing health and heart values
        p.damage = function(amount) {
            this.health -= amount;
            this.hearts.refresh(this.health);

            if (this.health <= 0) {$gameOver(this)};
        };


        // args are: animation name, array of frame numbers, frameRate, loop
        var deathAnim = p.animations.add('death', Phaser.Math.numberArray(0, 11),10,false);
        // after the death animation finishes the player needs to die
        deathAnim.killOnComplete = true;
        p.animations.add('falling',       Phaser.Math.numberArray(12,19),10,true);
        p.animations.add('idle',          Phaser.Math.numberArray(20,35),10,true);
        p.animations.add('jumping',       Phaser.Math.numberArray(36,43),10,true);
        p.animations.add('looking_down',  Phaser.Math.numberArray(44,59),10,true);
        p.animations.add('walking_left',  Phaser.Math.numberArray(60,67),10,true);
        p.animations.add('walking_right', Phaser.Math.numberArray(68,75),10,true);
        },
        this
    );

    $gameOver = function(loser) {
        //animName, loop, killOnComplete
        loser.dying = true;
        loser.animations.play('death');
        loser.staff.particleEmitter.removeAll(true, true);
        loser.staff.particleEmitter.kill();

        if (loser.projectile.charging) {
            loser.projectile.particleEmitter.removeAll(true, true);
            loser.projectile.particleEmitter.kill();
            loser.projectile.kill();
        };

        var victoryBannerName;
        if (loser.name === "player1") {victoryBannerName = "player2_victory_banner"}
        else { victoryBannerName = "player1_victory_banner"}

        game.add.sprite(game.world.width * 0.5, 200, victoryBannerName).anchor.setTo(0.5, 0.5);
        game.time.events.add(Phaser.Timer.SECOND * 4, function() {game.state.start('MainMenu')}, this);
    };    
    },

    update: function() {
    $players.forEach(function(p) {
        //collisions
        game.physics.arcade.collide(p, $ground);
        game.physics.arcade.collide(p, $projectiles,
            function(player, projectile) {
                if (projectile.owner != p) {
                    var damageAmount = Math.ceil((projectile.power) / 25); 
                    p.damage(damageAmount);

                    var x_knockback = (projectile.power / 100) * 0.5 * projectile.body.velocity.x;
                    var y_knockback = (projectile.power / 100) * 0.5 * projectile.body.velocity.y;
                    p.body.velocity.x += x_knockback;
                    p.body.velocity.y += y_knockback;

                    projectile.particleEmitter.kill();
                    projectile.kill();
                }
            }
        );
        // after the collision with the projectiles, the player might be dying
        if (p.dying) { return; }

        //physics
        p.body.velocity.x *= 0.95;
        if      (p.controls.left.isDown)  {p.body.velocity.x = -500}
        else if (p.controls.right.isDown) {p.body.velocity.x = 500}

        if      (p.controls.down.isDown)  {p.body.velocity.y += 20}
        //this is so the player can drop through the $platforms by holding down
        else {game.physics.arcade.collide(p, $platforms)}

        if (p.controls.up.isDown && p.body.touching.down) {
            p.body.velocity.y = -600
        }
            
        //animations and staff position changes
        if (p.body.velocity.y < -100) {
            p.animations.play('jumping');
            p.staff.x = p.body.center.x + 34;
            p.staff.y = p.body.center.y - 29; 
        }
        else if (p.body.velocity.y > 100) {
            p.animations.play('falling');
            p.staff.x = p.body.center.x + 34;
            p.staff.y = p.body.center.y - 29; 
        }
        else if (p.controls.down.isDown) {
            p.animations.play('looking_down');
            p.staff.x = p.body.center.x + 35;
            p.staff.y = p.body.center.y - 29; 
        }
        else if (p.body.velocity.x < -200) {
            p.animations.play('walking_left');
            p.staff.x = p.body.center.x - 32;
            p.staff.y = p.body.center.y - 31; 
        }
        else if (p.body.velocity.x > 200) {
            p.animations.play('walking_right');
            p.staff.x = p.body.center.x + 32;
            p.staff.y = p.body.center.y - 31; 
        }
        else {
            p.animations.play('idle');
            p.staff.x = p.body.center.x + 30;
            p.staff.y = p.body.center.y - 31;
        }

        //move the spark emitter to the new staff crystal position
        p.staff.particleEmitter.emitX = p.staff.x;
        p.staff.particleEmitter.emitY = p.staff.y;
        //move the power shot icon if it exists
        if (p.hasPowerShot) {
            p.powerShotIcon.body.x = p.body.x + 10;
            p.powerShotIcon.body.y = p.body.y - 80;
        };


        //projectile control
        if (p.projectile.charging) {
            //release the projectile if the player presses any projectile key
            //don't release if they're holding the key(this means that a projectile was created last frame)
            if (p.controls.justPressedProjectileKey()) {
                var x_velocity = 0;
                var y_velocity = 0;
                var projectileSpeed = 1000;
                if      (p.controls.left.isDown)    {x_velocity = -projectileSpeed}
                else if (p.controls.right.isDown)   {x_velocity =  projectileSpeed};
                
                if      (p.controls.up.isDown)      {y_velocity = -projectileSpeed}
                else if (p.controls.down.isDown)    {y_velocity =  projectileSpeed};

                // if they aren't pressing any movement keys then just shoot upwards
                if (x_velocity === 0 && y_velocity === 0) { y_velocity = -projectileSpeed };
                    
                //remember that p.projectile is just a pointer to the object in the $projectiles group
                p.projectile.body.velocity.x = x_velocity;
                p.projectile.body.velocity.y = y_velocity;

                p.projectile = {};
                p.projectile.charging = false; // saves it being null

                p.coolingDown = true;
                game.time.events.add(Phaser.Timer.SECOND, function() {this.coolingDown = false}, p);
            }
            else {
                // it would be nice just to change the sprite's anchor here
                // but that doesn't work for some reason, due to the scaling sprite
                // so manually set the x and y co-ordinates based on the changing width 
                var halfTheWidth = p.projectile.body.width * 0.5;
                p.projectile.body.x = p.staff.x - halfTheWidth;
                p.projectile.body.y = p.staff.y - halfTheWidth;
                p.projectile.charge();
            };

        }
        else if (p.coolingDown === false) {
            if      (p.controls.fireball.isDown)    {p.createProjectile('fireball_spritesheet', "fireball")}
            else if (p.controls.waterball.isDown)   {p.createProjectile('waterball_spritesheet', "waterball")}
            else if (p.controls.airball.isDown)     {p.createProjectile('airball_spritesheet', "airball")}
        };
    });
     
    //collide projectiles
    game.physics.arcade.collide($projectiles, $projectiles, function(p1, p2) {
        if (p1 != p2) {
            var t1 = p1.type;
            var t2 = p2.type;
            
            //determine whether an element wins the collision
            //water beats fire, fire beats air, air beats water
            switch(t1) {
                case "fireball":
                    if      (t2 === "waterball")    {p2.owner.givePowerShot()}
                    else if (t2 === "airball")      {p1.owner.givePowerShot()};
                    break;
                case "waterball":
                    if      (t2 === "fireball")     {p1.owner.givePowerShot()}
                    else if (t2 === "airball")      {p2.owner.givePowerShot()};
                    break;
                case "airball":
                    if      (t2 === "fireball")     {p2.owner.givePowerShot()}
                    else if (t2 === "waterball")    {p1.owner.givePowerShot()};
                    break;
            };

            //destroy both projectiles unless they have the same type
            if (t1 != t2) {
                p1.particleEmitter.kill();
                p1.kill();
                p2.particleEmitter.kill();
                p2.kill();
            }
        } 
    });
         

    //move the projectile particle emitters to the new projectile positions
    $projectiles.forEach(
        function(projectile) {
            var halfTheWidth = projectile.body.width * 0.5;
            projectile.particleEmitter.x = projectile.body.x + halfTheWidth;
            projectile.particleEmitter.y = projectile.body.y + halfTheWidth;
        },
        this
    );

    //clouds
    if (Math.random() < 0.001) {
        var cloud_image_name = Phaser.Math.getRandom(["cloud1", "cloud2", "cloud3"]);
        var cloud = $clouds.create(-50, 20 + Math.random() * 150, cloud_image_name);
        cloud.anchor.setTo(1, 0.5);
        cloud.body.velocity.x = 10 + Math.random() * 10;
    }
    //background smoke
    if (Phaser.Math.chanceRoll(1)) {$backgroundHouse.emitParticle()}
    }
};
