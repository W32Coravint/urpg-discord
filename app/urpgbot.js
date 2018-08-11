const Discord = require('discord.js')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const Enmap = require('enmap')

var urpgbot = new Discord.Client()
urpgbot.config = require('./config.js')

urpgbot.commands = new Enmap()
urpgbot.aliases = new Enmap()
urpgbot.util = {}

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
    const utlFiles = await readdir(`${__dirname}/util/`)
    utlFiles.forEach(f => {
        if(!f.endsWith('.js')) return;
        const eventName = f.split('.')[0];
        urpgbot.util[eventName] = require(`${__dirname}/util/${f}`)
        delete require.cache[require.resolve(`${__dirname}/util/${f}`)]
    })

    const cmdFiles = await readdir(`${__dirname}/commands/`)
    cmdFiles.forEach(f => {
        if(!f.endsWith('.js')) return
        const response = urpgbot.loadCommand(f)
        if (response) console.log(response)
    })

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