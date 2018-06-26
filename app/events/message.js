const help = require('../util/getHelp.js')
const logger = require('heroku-logger')

module.exports = (client, message) => {
    //Completely ignore messages from other bots
    if(message.author.bot) return

    //Ignore messages that don't start with the command prefix
    if(message.content.indexOf(client.config.PREFIX) !== 0) return

    //Translate the location of the message for logging purposes - Server (Guild) and channel, or DM
    var location = message.guild ? `${message.guild.name}:${message.channel.name}` :  "DM"
    logger.info(`${message.author.username} in ${location} - ${message.content}`)
    
    //Strip the prefix off the start of the message and split the arguments
    argsIn = message.content.slice(client.config.PREFIX.length).trim().split(/ +/g);
    argsOut = []

    //Get the first argumemt following the prefix
    const commandArg = argsIn.shift().toLowerCase();

    //Get the command by name or alias. Do nothing and return if no match. Can output a warning here if needed
    const cmd = client.commands.get(commandArg) || client.commands.get(client.aliases.get(commandArg))
    if(!cmd) return

    message.flags = [];
    argsIn.forEach((arg, index) => {
        //Flags are indicated by a - prefix, extract these to a separate array
        if(arg[0] === "-") {
            message.flags.push(arg.substring(1).toLowerCase())
            return
        }

        //Translate mentions into the GuildMember object. Ignores mentions in DMs
        if(arg.startsWith("<@") && message.guild) {
            arg = message.guild.members.get(arg.match(/\d+/g).join(''))
        }

        argsOut.push(arg)
    })

    //Single point of call for all help commands
    if(message.flags.includes('h')) {
        message.channel.send({'embed':help.output(cmd.help, cmd.conf.aliases)})
    }
    else {
        //Finally, run the command
        cmd.run(client, message, argsOut)
    }
}