const logger = require('heroku-logger')
const scripts = require('../util/scripts')

module.exports = (client, guildMember) => {
	server = guildMember.guild
	user = guildMember.user

	user.send({
		"embed": scripts.guildMemberAdd
	});

	logger.info(`${user.username} joined ${server.name}`, {
		key: 'guildMemberAdd'
	})
}