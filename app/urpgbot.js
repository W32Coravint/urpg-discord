const Discord = require('discord.js')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const Enmap = require('enmap')

var urpgbot = new Discord.Client()
urpgbot.config = require('./config.js')

urpgbot.commands = new Enmap()
urpgbot.aliases = new Enmap()

urpgbot.loadCommand = (commandName) => {
    try {
        const command = require(`${__dirname}/commands/${commandName}`)
        //urpgbot.logger.log(`Loading Command: ${props.help.name}`)

        if(!command.conf.enabled)
            return

        if (command.init) {
            command.init(urpgbot)
        }
        urpgbot.commands.set(command.conf.name, command)
        if(command.conf.aliases) {
            command.conf.aliases.forEach(alias => {
                urpgbot.aliases.set(alias, command.conf.name)
            });
        }
        return false
    } catch (e) {
        return `Unable to load command ${commandName}: ${e}`
    }
}

urpgbot.init = async () => {
    //Load in all the utility files directly to the bot
    const utilFiles = await readdir(`${__dirname}/util/`)
    utilFiles.forEach(f => {
        if(!f.endsWith('.js')) return;
        const utilName = f.split('.')[0];
        urpgbot[utilName] = require(`${__dirname}/util/${f}`)
        delete require.cache[require.resolve(`${__dirname}/util/${f}`)]
    })

    //Load in all the Mongoose models
    const modelFiles = await readdir(`${__dirname}/models/`)
    urpgbot.models = []
    modelFiles.forEach(f => {
        if(!f.endsWith('.js')) return;
        const modelName = f.split('.')[0];
        urpgbot.models[modelName] = require(`${__dirname}/models/${f}`)
        delete require.cache[require.resolve(`${__dirname}/models/${f}`)]
    })

    //Then load the commands
    const cmdFiles = await readdir(`${__dirname}/commands/`)
    cmdFiles.forEach(f => {
        if(!f.endsWith('.js')) return
        const response = urpgbot.loadCommand(f)
        if (response) console.log(response)
    })

    //Finally, load the event handlers
    const evtFiles = await readdir(`${__dirname}/events/`)
    evtFiles.forEach(f => {
        if(!f.endsWith('.js')) return
        const eventName = f.split('.')[0];
        const event = require(`${__dirname}/events/${f}`)
        urpgbot.on(eventName, event.bind(null, urpgbot))
        delete require.cache[require.resolve(`${__dirname}/events/${f}`)]
    })
}

module.exports = urpgbot