'use strict';

let DiscordClient = require('discord.io');
let Router = require('routes');

class Bot {
    constructor (configdata, readyCallback, address)
    {
        this.address = address || "Hey CarpeTron, ";
        this.router = new Router();
        this.commands = [];

        this.config = configdata;
        if (typeof this.config.autorun === "undefined") this.config.autorun = true;

        this.discord = new DiscordClient(this.config);

        if (readyCallback)
        {
            this.discord.on('ready', readyCallback);
        }

        this.discord.on('message', (user, userID, channelID, message) => {
            let messageObject = {
                user: user,
                userID: userID,
                channelID: channelID,
                text: message,

                reply: (text) => {
                    this.discord.sendMessage({
                        to: channelID,
                        message: text
                    });
                },

                replyPrivate: (text) => {
                    this.discord.sendMessage({
                        to: userID,
                        message: text
                    });
                }
            };

            let route = this.router.match(message);
            if (route)
            {
                route.fn.apply(null, [messageObject, route.params]);
            }
        });
    }

    addRoute(route, callback)
    {
        this.commands.push(route);
        this.router.addRoute(this.address + route, callback);
    }

    setGame(game)
    {
        this.discord.setPresence({game: game});
    }

    sendMessage(to, text)
    {
        this.discord.sendMessage({to: to, message: text});
    }
}

module.exports = Bot;
