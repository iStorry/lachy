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
                var stream, dispatcher;
                    core.isValidChannel(message, function(result){
                        result.join().then(connection => {
                            core.isPlaylistPlay(message, client, function(result) {
                                for (let index = 0; index < result.length; index++) {
                                    console.log("Playing : " + result[index].song_name);
                                    const stream = ytdl(result[index].song_url, { filter : 'audioonly' });
                                    const dispatcher = connection.playStream(stream, options);
                                    dispatcher.on("end", end => {
                                        console.log("Ended : " + result[index].song_name);
                                    });
                                }
                            })
                        }).catch(err => console.log(err));
                    });
                break
                default: core.isHelp(message, client); break
            }
            case "play":
                message.delete();
                core.isValidOwnerRLI(message);
                if (args[1]) { 
                    core.isValidChannel(message, function(result){
                        result.join().then(connection => {
                            var stream = ytdl(uri[1], { filter : 'audioonly' });
                            var dispatcher = connection.playStream(stream, options);
                            dispatcher.on("end", end => {
                                console.log("Song Ended");
                            });
                        });
                    });
                }
                else { return core.isReply(message, client, "Youtube URL Required."); }
            break
            case "ping": message.reply("`" + client.ping + "!ms`"); break;
        break
    }

});

client.login(key.token);


