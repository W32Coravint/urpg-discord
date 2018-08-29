const logger = require('heroku-logger')

findExactSpecies = (message, speciesName, callback, error) => {
    //Exact match the species
    urpgbot.models.species.findOne({
        'speciesName': new RegExp(`^${speciesName}$`, 'i')
    }, (err, result) => {
        if (err) {
            message.channel.send("Unable to access the database at the current time. Please try again later.")
            logger.error(`DB error while searching for ${speciesName}`, {
                key: 'starter'
            })
            callback(null)
        }
        if (!result || result.length == 0) {
            callback("nomatch", null)
        } else {
            if (!result.starterEligible) {
                callback("illegal", result)
            } else {
                callback(null, result)
            }
        }
    })
}

findPartialSpecies = (message, speciesName, callback, error) => {
    urpgbot.models.species.find({
        'speciesName': new RegExp(speciesName, 'i')
    }, (err, result) => {
        if (err) {
            message.channel.send("Unable to access the database at the current time. Please try again later.")
            logger.error(`DB error while searching for ${speciesName}`, {
                key: 'item'
            })
            error()
        }
        if (!result || result.length == 0) {
            callback({
                "error": `No Pokemon matching "${speciesName}" could be found. Check your spelling and try again`
            })
        } else if (result.length > 1) {
            legalStarters = result.filter(element => element.starterEligible)

            if (legalStarters.length == 1) {
                callback(null, legalStarters[0])
            }

            if (legalStarters.length > 1)
                callback("multimatch", legalStarters)
            else
                callback("nomatch", null)
        } else callback(null, result[0])
    })
}

confirmStarter = (urpgbot, message, result) => {
    message.channel.send(urpgbot.util.scripts.starter.confirm(result)).then(sentMessage => {
        sentMessage.react("✅").then(() => {
            sentMessage.react("❌").then(() => {
                filter = (reaction, user) => ["✅","❌"].includes(reaction.emoji.name) && user.id === message.author.id
                collector = sentMessage.createReactionCollector(filter, { time: 300000, max: 1 })
                collector.on('collect', react => {
                    collector.stop()
                })
                collector.on('end', (collected, reason) => {
                    if(collected.reason == "time") {
                        message.channel.send("Sorry, your !starter request has timed out. You can make another whenever you are ready!")
                    } else {
                        console.log(collected.first())
                        collected.first()._emoji.name === "✅" ? acceptStarter(message, result) : rejectStarter(message, result)
                    }
                })
            })
        })
    })
}

acceptStarter = (message, result) => {
    console.log("Accepted")
}

rejectStarter = (message, result) => {
    console.log("Rejected")
}

exports.run = (urpgbot, message, args) => {
    //Reject the request if no starter was provided
    if (args.length == 0) {
        message.channel.send(`You need to specify a starter Pokemon!`)
        return
    }

    starterRequest = {}

    //Lookup the starter in the Species database
    findExactSpecies(message, args[0], (err, result) => {
        if (err) {
            message.channel.send(urpgbot.util.scripts.starter[err](result))
            return
        }
        if (result) {
            confirmStarter(urpgbot, message, result)
        } else findPartialSpecies(message, args[0], (err, result) => {
            if (err) {
                message.channel.send(urpgbot.util.scripts.starter[err])
                return
            }
            if (result) confirmStarter(urpgbot, message, result)
        })
    })

    /*
        trainer = new Trainer({
            discord_id: message.author.id,
            username: message.member.nickname || message.author.username
        })


        trainer.save((err, saved) => {
            if (err) {
                if (err.code == 11000) {
                    message.channel.send("Sorry, you've already started playing URPG!")
                    logger.info(`New trainer request from ${trainer.username} rejected - already exists`, {
                        key: "starter"
                    })
                } else {
                    message.channel.send("An unknown error has occured - please notify an admin")
                    logger.error(error, {
                        key: "starter"
                    })
                }
            } else {
                message.channel.send(`Congratulations! New trainer ${trainer.username} registered.`)
                logger.info(`New trainer ${trainer.username} (${trainer.discord_id}) registered.`, {
                    key: "starter"
                })
            }
        })
    */
}

exports.init = (urpgbot) => {

}

exports.conf = {
    name: "starter",
    enabled: true,
    aliases: ["start"]
}

exports.help = {
    name: "starter",
    category: "Game",
    shortDesc: "",
    description: "",
    usage: ``
}