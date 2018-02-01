const key = require('./json/token');
const Discord = require('discord.js');
const Youtube = require('discord-youtube-api');
const config = require('./manage/permissions');
const songs = require('./manage/songs');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const yt = new Youtube(key.youtube_token);
const streamOptions = { seek: 0, volume: 1 };
const prefix = "!";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Node.JS");
});

client.on('message', (message) => {

    if (message.author.bot) return;
    var msg = message.content.toLowerCase();
    var explode = msg.split(" ");
    var args = msg.substring(prefix.length).split(" ");
    var uri = message.content.substring(prefix.length).split(" ");

    if (!message.content.startsWith(prefix)) return;

    switch (args[0]) {
        case "play":
            message.delete();
            config.isValidOwner(message);
            config.isValidChannel(message, function(result){
                result.join().then(connection => {
                    config.isMessageEmbed(message, "Joined Voice Channel", uri[1], client);
                    const stream = ytdl(uri[1], { filter : 'audioonly' });
                    const dispatcher = connection.playStream(stream, streamOptions);
                    dispatcher.on("end", end => {
                        console.log("left channel");
                        result.leave();
                    });
                }).catch(err => console.log(err));
            });
            
            // songs.isValidURL(yt, uri[1], function(result) {
            //     message.channel.send("You're About To Play : `" + result["title"] + "`");
            // });
        break
        case "pruge":
            message.channel.bulkDelete(100).catch(error => message.channel.send(`Error: ${error}`)); // If it finds an error, it posts it into the channel.
        break
        case "ping":
            message.channel.send("`"+ client.ping + "!ms`");
        break
    }

});

client.login(key.token);


