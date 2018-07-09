const mongoose = require('mongoose')
const logger = require('heroku-logger')
const Trainer = require('../models/trainer')

exports.run = (client, message, args) => {
    trainer = new Trainer({
        discord_id: message.author.id,
        username: message.member.nickname || message.author.username
    })

    trainer.save((err, trainer) => {
        if(err.code == 11000) {
            message.channel.send("Sorry, you've already started playing URPG!")
        }
    })

}

exports.init = (client) => {
    
}

exports.conf = {
    name: "starter",
    enabled: true,
}

exports.help = {
    name: "starter",
    category: "Game",
    shortDesc: "",
    description: "",
    usage: ``
}