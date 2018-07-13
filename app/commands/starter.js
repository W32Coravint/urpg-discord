const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Trainer = require('../models/trainer')

exports.run = (client, message, args) => {
    trainer = new Trainer({
        discord_id: message.author.id,
        username: message.member.nickname || message.author.username
    })

    console.log(message.flags);
    console.log(args);

    trainer.save((err, saved) => {
        if(err.code == 11000) {
            message.channel.send("Sorry, you've already started playing URPG!")
            logger.info(`New trainer request from ${trainer.username} rejected - already exists`, {key:"starter"})
        }
        else if(err) {
            message.channel.send("An unknown error has occured - please notify an admin")
            logger.error(error, {key:"starter"})
        }
        else {
            message.channel.send(`Congratulations! New trainer ${trainer.username} registered.`)
            logger.info(`New trainer ${trainer.username} (${trainer.discord_id}) registered.`, {key:"starter"})
        }
    })

}

exports.init = (client) => {
    
}

exports.conf = {
    name: "starter",
    enabled: false,
    aliases: ["start"]
}

exports.help = {
    name: "starter",
    category: "Game",
    shortDesc: "",
    description: "",
    usage: ``
}