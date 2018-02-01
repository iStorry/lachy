const database = require('./database');
const reply = require('./reply');
const key = require('../json/token.json');

module.exports = {
    isReply: function(message, client, title) {
        message.channel.startTyping();
        message.reply({embed: {
            color: 3399661,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: title,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "© " + client.user.username
            }
        }}).then(msg => console.log(`Sent a reply to ${msg.author}`))
        message.channel.stopTyping()
    },
    isValidOwner: function(message) {
        if (!message.member.roles.find("name", "Lab Rat")) {
            message.channel.send('You need the \`Lab Rat\` role to use this command.');
            return;
        }
    },
    isValidOwnerRLI: function(message) {
        if (!message.member.roles.find("name", "RLI Bot Commander")) {
            message.channel.send('You need the \`RLI Bot Commander\` role to use this command.');
            return;
        }
    },
    isValidChannel: function(message, response) {
        var voice = message.member.voiceChannel;
        if (voice !== undefined) {
            response(voice);
        } else {  
            message.channel.send({embed: {
                color: 3447003,
                description: "Join Voice Channel First",
            }});
        }
    },
    isMessageEmbed: function(message, description, url, client) {
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            description: description,
            url: url,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "© " + client.user.username
            }
        }});
    },
    isValidURL: async function(youtube, url, result) {
        var response = await youtube.getVideo(url);
        result(response);
    },
    isHelp: function(message, client) {
        message.channel.startTyping();
        message.reply({embed: {
            color: 3399661,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: "Basic Commands",
            description: "!play \n!playlist create {name} \n!playlist remove {name}\n!playlist view {name}",
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "© " + client.user.username
            }
        }}).then(msg => console.log(`Sent a reply to ${msg.author}`))
        message.channel.stopTyping()
    },
    isPlaylistMake: function(message, client, name) {
        database.isCollection(key.collection);
        var json = { name: name };
        database.isQuery(json, key.collection, function(result){
            if (result.length !== 0) return reply.isInstantReply(message, client, "Playlist already exists with this name.");
            var json = { name: name, userid: message.member.id };
            database.isInsertData(json);
            reply.isInstantReply(message, client, "Playlist " + name + " created.");
        });
    },
    isPlaylist: function(message, client, name) {
        var json = { name: name };
        var text = "";
        database.isCollection(key.songs_collection);
        database.isQuery(json, key.collection, function(result){
            if (result.length == 0) return reply.isInstantReply(message, client, "Unable to locate playlist.");
            var json = { playlist: name };
            database.isQuery(json, key.songs_collection, function(result){
                if (result.length == 0) return reply.isInstantReply(message, client, "No songs found in playlist.");
                for (i = 0; i < result.length; i++) {
                    text += result[i].song_name + "\n";
                }
                reply.isReplyMore(message, client, "Total No of Songs : " + result.length, text)
            });
        });
    },
    isPlaylistPlay: function(message, client, response) {
        var json = { userid: message.author.id };
        var text = "";
        database.isCollection(key.songs_collection);
        database.isQuery(json, key.collection, function(result){
            if (result.length == 0) return reply.isInstantReply(message, client, "Unable to locate playlist.");
            var json = { owner_id: message.author.id };
            database.isQuery(json, key.songs_collection, function(result){
                if (result.length == 0) return reply.isInstantReply(message, client, "No songs found in playlist.");
                response(result)
            });
        });
    },
    isAddSongs: function(message, client, url, name) {
        var json = { userid: message.author.id };
        database.isQuery(json, key.collection, function(result){
            if (result.length == 0) return reply.isInstantReply(message, client, "Can\'t find any playlist register with this user.");
            var json = {
                playlist: result[0].name,
                song_name: name,
                song_url: url,
                owner_id: message.author.id,
                owner_name: message.author.username
            };
            database.isInsertData(json, key.songs_collection);
            reply.isInstantReply(message, client, "`" + name + "` Added To : `" + result[0].name + "`.");
        });
       

    }
}
//const ytdl = require('ytdl-core');
//const yt = new Youtube(key.youtube_token);
