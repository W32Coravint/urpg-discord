const logger = require('heroku-logger')
const request = require('request')
const Species = require('../models/species')

exports.run = (urpgbot, message, args) => {
    var embed =  {
        title: "Pokedex Search",
        description: `Searching URPG and online Pokedexes...`,
        fields: []
    }

    args = args.map(string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    })
    
    var search = args.join(' ')
    var dex = args.join('_')

    message.channel.send({"embed": embed})
    .then(message => {
        embed.description = `Pokedex search results for "${dex}"`

        request({
            "rejectUnauthorized": false,
            "url": `https://pokemonurpg.com:8443/pokemon/name/${dex}`
        }, (err, res, body) => {
            if(!err) {
                data = JSON.parse(body)
                if(JSON.parse(body).dex != "") {
                    embed.fields.push({
                        name: "URPG Ultradex",
                        value: `https://pokemonurpg.com/pokemon/${dex}`
                    })
                    embed.color = parseInt(urpgbot.util.colorMap[data.type1.toLowerCase()], 16)
                }
            }
            else console.error(err)

            request(`https://bulbapedia.bulbagarden.net/wiki/${dex}`, (err, res, body) => {
                console.log(res.statusCode)
                console.log(`https://bulbapedia.bulbagarden.net/wiki/${dex}`)
                if(!err && res.statusCode != 404) {
                    embed.fields.push({
                        name: "Bulbapedia",
                        value: `https://bulbapedia.bulbagarden.net/wiki/${dex}`
                    })
                }

                embed.description = embed.fields.length > 0 ? `Pokedex search results for "${search}"` : `No results found for "${search}"`
                message.edit({"embed":embed})
            })
        })
    })

    logger.info(`${message.author.username} searched for ${dex}`,{key:'dex'})
}

exports.conf = {
    name: "dex",
    enabled: true
}

exports.help = {
    name: "dex",
    category: "Game",
    description: "Retrieve a Pokemon from the Ultradex",
    usage: `
!dex <pokemon>    Get the Ultradex page for <pokemon>`
}