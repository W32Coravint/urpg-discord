const mongoose = require('mongoose')
const logger = require('heroku-logger')
const config = require('./app/config.js')
const urpgbot = require('./app/urpgbot.js')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI)
const db = mongoose.connection

db.on('connected', () => {
    logger.info(`Mongoose default connection open`)
})
db.on('error', (err) => {
    logger.error(`Mongoose default connection error: ${err}`)
})
db.on('disconnected', () => {
    console.warn(`Mongoose default connection disconnected`)
})

process.on('SIGINT', function() {
    db.close(function () {
        logger.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

urpgbot.on('ready', () => {
    if(urpgbot.config.OWNER) {
        urpgbot.fetchUser(urpgbot.config.OWNER).then((user) => {
            user.send("URPG Discord bot started")
        })
        .catch((error) => {
            logger.info("Owner ID incorrect - no matching user found")
        })
    }
    else {
        logger.info("No owner ID provided")
    }
    
    urpgbot.init()
})

db.once('open', () => {
    try {
        urpgbot.login(process.env.DISCORD_TOKEN || config.DISCORD_TOKEN).then(() => {
            logger.info('Authenticated to Discord.')
        })
    } catch(e) {
        logger.error('Unable to authenticate to Discord.')
    }
})