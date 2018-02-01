const key = require('./json/token');
const discord = require('discord.js');
const core = require('./manage/core');
const database = require('./manage/database');
const client = new discord.Client();
const options = { seek: 0, volume: 1 };
const google = require("discord-youtube-api");
const youtube = new google(key.youtube_token);
const ytdl = require('ytdl-core');


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Youtube");
    database.isDatabase();
});

client.on('message', (message) => {

    if (message.author.bot) return;
    var msg = message.content.toLowerCase();
    var explode = msg.split(" ");
    var args = msg.substring(key.prefix.length).split(" ");
    var uri = message.content.substring(key.prefix.length).split(" ");

    if (!message.content.startsWith(key.prefix)) return;
    switch (args[0]) {
        case "help": core.isHelp(message, client); break;
        case "playlist":
            switch (args[1]) {
                case "create":
                    if (args[2]) { core.isPlaylistMake(message, client, args[2]); }
                    else { return core.isReply(message, client, "Please Enter A Playlist Name"); }
                break
                case "view": 
                    if (args[2]) { core.isPlaylist(message, client, args[2]); }
                    else { return core.isReply(message, client, "Please Enter A Playlist Name"); }
                break
                case "add": 
                    message.delete();
                    if (args[2]) { 
                        core.isValidURL(youtube, uri[2], function(result){
                            if (result["title"]) { core.isAddSongs(message, client, uri[2], result["title"]); }
                            else { return core.isReply(message, client, "Invalid Youtube URL"); }
                        });
                    }
                    else { return core.isReply(message, client, "Please Enter A Playlist Name"); }
                break
                case "play":
                    core.isValidChannel(message, function(result){
                        result.join().then(connection => {
                            core.isPlaylistPlay(message, client, function(result) {
                                const stream = ytdl(result, { filter : 'audioonly' });
                                const dispatcher = connection.playStream(stream, options);
                                dispatcher.on("end", end => {
                                });
                            })
                            //result.leave();
                        }).catch(err => console.log(err));
                    });
                break
                default: core.isHelp(message, client); break
            }
        break
        // case "play":
        //     // message.delete();
        //     // config.isValidChannel(message, function(result){
        //     //     result.join().then(connection => {
        //     //         config.isMessageEmbed(message, "Joined Voice Channel", uri[1], client);
        //     //         const stream = ytdl(uri[1], { filter : 'audioonly' });
        //     //         const dispatcher = connection.playStream(stream, streamOptions);
        //     //         dispatcher.on("end", end => {
        //     //             console.log("left channel");
        //     //             result.leave();
        //     //         });
        //     //     }).catch(err => console.log(err));
        //     // });
            
        //     // songs.isValidURL(yt, uri[1], function(result) {
        //     //     message.channel.send("You're About To Play : `" + result["title"] + "`");
        //     // });
        // break
        // case "leave":
        //     config.isValidOwner(message);
        // break
    }

});

client.login(key.token);


