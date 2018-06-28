const logger = require('heroku-logger')

module.exports = (client, guildMember) => {
    server = guildMember.guild
    user = guildMember.user

    /* Currently this is just a generic welcome message to test the event
     * This should be fleshed out with full URPG introductory script
     * Probably also beneficial to require('../util/getHelp.js')
     * and use that for bot command output */
    user.send(`Hi ${user.username}, and welcome to ${server.name}!`)
}