'use strict';

let announceChannel = "133333189132419072";
var Discbot = require('./discbot');

var bot = new Discbot(require('./auth.json'), () => {
    bot.setGame("Half Life 3");
    bot.sendMessage(announceChannel, "Started up and ready to serve...");
});

bot.addRoute('Please play :game', (message, params) => {
    message.reply("I'm playing " + params.game + " now!");
    bot.setGame(params.game);
});

bot.addRoute('Hello :name', (message, params) => {
    message.reply("Indeed, hello "+ params.name + "!");
});

let queryableServices = ["apache"];
let exec = require('child_process').exec;
bot.addRoute('Status of :daemon', (message, params) => {
    if (queryableServices.indexOf(params.daemon) !== -1)
    {
        exec("systemctl status " + params.daemon, (error, stdout, stderr) => {
            message.reply(stdout);
        });
    }
});

let liveUsers = {};
let watchedUsers = require('./hitbox_watchlist.json');
let Hitbox = require('./hitbox')
setInterval(() => {
    watchedUsers.forEach((username) => {
        Hitbox.user(username, (data) => {
            console.error(data);

            let live = (data.is_live === "1");
            if (live && !liveUsers[username]) {
                bot.sendMessage(announceChannel, username + " just went live! http://www.hitbox.tv/" + username);
            } else if (live && liveUsers[username]) {
                bot.sendMessage(announceChannel, username + " just went offline :(");
            }
            liveUsers[username] = data.is_live;
        });
    });
}, 10000);
