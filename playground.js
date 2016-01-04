'use strict';

var Discbot = require('./discbot');

var bot = new Discbot(require('./auth.json'));

bot.addRoute('Please play :game', (message, params) => {
    message.reply("I'm playing " + params.game + " now!");
    bot.setGame(params.game);
});

bot.addRoute('Hallo :name', (message, params) => {
    message.reply("Auch Hallo "+ params.name + "!");
    message.replyPrivate("Du hast gerade " + params.name + " gehallot.");
});

let exec = require('child_process').exec;
bot.addRoute('Status von :daemon', (message, params) => {
    if (/^\w+/.exec(params.daemon))
    {
        exec("systemctl status " + params.daemon, (error, stdout, stderr) => {
            message.reply(stdout);
        });
    }
});
