
module.exports = {
    isValidOwner: function(message) {
        if (!message.member.roles.find("name", "Lab Rat")) {
            message.channel.send('You need the \`Lab Rat\` role to use this command.');
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
    }
}