const logger = require('heroku-logger')

module.exports = (err, file, line) => {
    //So APPARENTLY the mere EXISTENCE of this error handler
    //will make the bot auto-reconnect. Might as well log too
    logger.error(`Error ${err} in ${file}:${line}`)
}