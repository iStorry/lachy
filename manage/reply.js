module.exports = {
    isInstantReply: function(message, client, title) {
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
    isReplyMore: function(message, client, title, description) {
        message.channel.startTyping();
        message.reply({embed: {
            color: 3399661,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: title,
            description: description,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "© " + client.user.username
            }
        }}).then(msg => console.log(`Sent a reply to ${msg.author}`))
        message.channel.stopTyping()
    }
}