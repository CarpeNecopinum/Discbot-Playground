'use strict';

let announceChannel = "133333189132419072";
var Discbot = require('./discbot');

/// Some screwing around

var bot = new Discbot(require('./auth.json'), () => {
    bot.setGame("Half Life 3");
    bot.sendMessage(announceChannel, "Started up and ready to serve... (" + bot.address + ")");
}, "Hey CarpeTron, ");

bot.addRoute('play :game', (message, params) => {
    message.reply("I'm playing " + params.game + " now!");
    bot.setGame(params.game);
});

bot.addRoute('stop playing', (message) => {
    message.reply("Ok, I'll stop playing ._.");
    bot.setGame(null);
});

bot.addRoute('what can you do?', (message) => {
    var answer = "I react to: \n";
    answer += bot.address + " ...\n";
    bot.commands.forEach((cmd) => answer += "... " + cmd + "\n");
    message.reply(answer);
});

bot.addRoute('flip a coin!', (message) => {
    var answer = (Math.floor(Math.random() * 2) == 0) ? 'Heads!' : 'Tails!';
    message.reply(answer);
});

let nsfw = [
    "http://i.imgur.com/r3oM09x.jpg",
    "http://i.imgur.com/PB9B0yO.jpg",
    "http://i.imgur.com/RaPcAxb.jpg",
    "http://i.imgur.com/2g4SQ9w.jpg",
    "http://i.imgur.com/U0RdE37.jpg"
];

bot.addRoute('be NSFW', (message) => {
    let link = nsfw[Math.floor(Math.random() * nsfw.length)];
    message.reply(link);
});

/*
let queryableServices = ["apache"];
let exec = require('child_process').exec;
bot.addRoute('Status of :daemon', (message, params) => {
    if (queryableServices.indexOf(params.daemon) !== -1) {
        exec("systemctl status " + params.daemon, (error, stdout, stderr) => {
            message.reply(stdout);
        });
    }
});*/


/// Hitbox-watching
var jsonfile = require('jsonfile');

let observings = {};
try {
    observings = jsonfile.readFileSync('observations.json');
} catch(e) {}

let saveObservations = function() {
    jsonfile.writeFile('observations.json', observings, (err) => {
        console.error(err);
    });
};

let observeStreamerForID = (streamer, reportTo) => {
    if (!observings[reportTo]) observings[reportTo] = [];
    observings[reportTo].push(streamer);
};

bot.addRoute('tell me when :streamer starts streaming', (message, params) => {
    observeStreamerForID(params.streamer, message.userID);
    message.replyPrivate('I will tell you when ' + params.streamer + ' goes online.');
    saveObservations();
});

bot.addRoute('tell the channel when :streamer starts streaming', (message, params) => {
    observeStreamerForID(params.streamer, message.channelID);
    message.reply('I will tell you when ' + params.streamer + ' goes online.');
    saveObservations();
});


let liveUsers = {};
let Hitbox = require('./hitbox');
setInterval(() => {
    // Collect all observed Streamers from all people
    let allStreamers = [];
    for (var user in observings) {
        allStreamers.push(observings[user]);
    }

    // Collect state changes of all these streamers
    let statusChanges = {};
    allStreamers.forEach((username) => {
        Hitbox.user(username, (data) => {
            console.error(data);

            let live = (data.is_live === "1");
            if (live && !liveUsers[username]) {
                statusChanges[username] = 'online';
            } else if (!live && liveUsers[username]) {
                statusChanges[username] = 'offline';
            }
            liveUsers[username] = data.is_live;
        });
    });

    // Notify people about state changes of the people they observe
    for (let user in observings) {
        observings[user].forEach((streamer) => {
            if (statusChanges[streamer] === 'online')
            {
                bot.sendMessage(user, streamer + " just went live! http://www.hitbox.tv/" + streamer);
            }
        });
    }
}, 10000);
