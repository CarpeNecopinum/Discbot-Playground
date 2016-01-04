'use strict';

let request = require('request');

module.exports = {
    user(username, callback)
    {
        request(
            "https://api.hitbox.tv/user/"+username+".json?showHidden=true",
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(JSON.parse(body));
                }
            }
        );
    }
}
