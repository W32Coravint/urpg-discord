const logger = require('heroku-logger')

exports.run = (urpgbot, message, args) => {
    if(message.author_guild._roles.some(r => [urpgbot.util.serverRoles.moderator.id,urpgbot.util.serverRoles.official.id].includes(r))) {
        message.channel.createInvite({
            maxAge: 0,
            maxUses: 1,
            unique: true,
            reason: `Generated by ${message.author.username}`
        }).then(invite => {
            message.author.send(`Invite generated: ${invite.url}`)
            logger.info(`${message.author.username} generated an invite link ${invite.url}`,{key:'invite'})
        }).catch(error => {
            logger.error(error, {key:'invite'})
        })
    }
    else {
        message.author.send("Sorry, this command is only available to mods and officials")
    }
}

exports.conf = {
    name: "invite",
    enabled: true
}

exports.help = {
    name: "invite",
    category: "Admin",
    description: "Generate a single use invite link",
    usage: `!invite`
}