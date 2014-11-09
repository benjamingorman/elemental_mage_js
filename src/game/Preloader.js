GameCtrl.Preloader = function() {
};

GameCtrl.Preloader.prototype = {
    preload: function() {
        var assets = [
         {type:'image',       key:'player2_victory_banner', url:"images/ui/player2_victory_banner.png"}
        ,{type:'image',       key:'player1_victory_banner', url:"images/ui/player1_victory_banner.png"}
        ,{type:'image',       key:'about_sheet',            url:"images/about_sheet.png"}
        ,{type:'image',       key:'instructions_sheet',     url:"images/instructions_sheet.png"}
        ,{type:'image',       key:'title_image',            url:"images/menu/title_image.png"}
        ,{type:'image',       key:'particle_spark',         url:"images/particles/spark.png"}
        ,{type:'image',       key:'particle_waterball',     url:"images/particles/waterball_particle.bmp"}
        ,{type:'image',       key:'particle_fireball',      url:"images/particles/fireball_particle.bmp"}
        ,{type:'image',       key:'particle_airball',       url:"images/particles/airball_particle.png"}
        ,{type:'image',       key:'particle_smoke',         url:"images/particles/smoke_particle.bmp"}
        ,{type:'image',       key:'heart_full',             url:"images/ui/heart_full.png"}
        ,{type:'image',       key:'heart_three_quarters',   url:"images/ui/heart_three_quarters.png"}
        ,{type:'image',       key:'heart_half',             url:"images/ui/heart_half.png"}
        ,{type:'image',       key:'heart_one_quarter',      url:"images/ui/heart_one_quarter.png"}
        ,{type:'image',       key:'heart_empty',            url:"images/ui/heart_empty.png"}
        ,{type:'image',       key:'player1_icon',           url:"animations/player1/head.png"}
        ,{type:'image',       key:'player2_icon',           url:"animations/player2/head.png"}
        ,{type:'image',       key:'bridge_and_sky',         url:"images/scenery/bridge_and_sky.png"}
        ,{type:'image',       key:'platform',               url:"images/scenery/platform.png"}
        ,{type:'image',       key:'cloud1',                 url:"images/scenery/cloud1.png"}
        ,{type:'image',       key:'cloud2',                 url:"images/scenery/cloud2.png"}
        ,{type:'image',       key:'cloud3',                 url:"images/scenery/cloud3.png"}
        ,{type:'spritesheet', key:'player1_spritesheet',    url:"animations/player1/spritesheet.png",         width:96,  height:96}
        ,{type:'spritesheet', key:'menu_buttons',           url:"images/menu/menu_buttons.png",               width:300, height:80}
        ,{type:'spritesheet', key:'power_shot_spritesheet', url:"animations/elemental_orbit.png",             width:64,  height:64}
        ,{type:'spritesheet', key:'waterball_spritesheet',  url:"animations/projectiles/waterball_16x16.png", width:16,  height:16}
        ,{type:'spritesheet', key:'fireball_spritesheet',   url:"animations/projectiles/fireball_16x16.png",  width:16,  height:16}
        ,{type:'spritesheet', key:'airball_spritesheet',    url:"animations/projectiles/airball_16x16.png",   width:16,  height:16}
        ,{type:'spritesheet', key:'player2_spritesheet',    url:"animations/player2/spritesheet.png",         width:96,  height:96}
        ,{type:'sound',       key:'hurt',                   url:"sounds/hurt.ogg"}
        ,{type:'sound',       key:'wizards_keep',           url:"sounds/wizards_keep.ogg"}
        ,{type:'sound',       key:'victory',                url:"sounds/victory.ogg"}
        ,{type:'sound',       key:'power_up',               url:"sounds/power_up.ogg"}
        ,{type:'sound',       key:'projectile_release',     url:"sounds/projectile_release.ogg"}
        ];

        game.load.crossOrigin = "Anonymous";

        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];
            var asset_url = GameCtrl.static_url.concat(asset.url);
            console.log("asset url:", asset.url);

            switch (asset.type) {
                case 'image':
                    game.load.image(asset.key, asset_url);
                    break;
                case 'spritesheet':
                    game.load.spritesheet(asset.key, asset_url, asset.width, asset.height);
                    break;
                case 'sound':
                    game.load.audio(asset.key, asset_url);
                    break;
            };
        };
    },

    create: function() {
        game.state.start('MainMenu');
    }
}
