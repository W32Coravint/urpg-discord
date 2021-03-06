const logger = require('heroku-logger')

getAnnouncement = (announce) => {
    switch(announce) {
        case "Active": return "Announced on activation"
        case "Enter": return "Announced on entry"
        case "Hidden": return "Hidden"
        default: return ""
    }
}

exports.run = (urpgbot, message, args) => {
    if(args.length == 0) return

    var search = args.join(' ')
    urpgbot.models.ability.findOne().exact(search).exec((err, result) => {
        if(err) {
            message.channel.send("Unknown error querying the database - the technical team has been notified")
            
            return
        }
        if(result) {
            embed = { 
                title: `${result.abilityName}`,
                description: `${result.desc}`, 
                fields: [],
                footer: {}
            }
            if(result.announcement) {
                embed.title += ` | ${getAnnouncement(result.announcement)}`
            }
            if(result.affects) {
                affects = result.affects.split('\\n')
                field = {
                    name: `**Interacts with the following:**`,
                    value: ``
                }
                affects.forEach(a => {
                    field.value += `${a}\n`
                })
                embed.fields.push(field)
            }
            if(result.additional) {
                embed.footer = {
                    "text": result.additional
                }
            }
            message.channel.send({'embed':embed})
        }
        else {
            urpgbot.models.ability.find().partial(search).exec((err, result) => {
                switch (result.length) {
                    case 0:
                        message.channel.send(`No results found for ${search}`)
                        return
                    case 1:
                        result = result[0]
                        embed = { 
                            title: `${result.abilityName}`,
                            description: `${result.desc}`, 
                            fields: [],
                            footer: {}
                        }
                        if(result.announcement) {
                            embed.title += ` | ${getAnnouncement(result.announcement)}`
                        }
                        if(result.affects) {
                            affects = result.affects.split('\\n')
                            field = {
                                name: `**Interacts with the following:**`,
                                value: ``
                            }
                            affects.forEach(a => {
                                field.value += `${a}\n`
                            })
                            embed.fields.push(field)
                        }
                        if(result.additional) {
                            embed.footer = {
                                "text": result.additional
                            }
                        }
                        break
                    default:
                        embed = { 
                            title: `${result.length} result(s) found for "${search}"`, 
                            description: ``, 
                        }
                        result.forEach((r) => {
                            embed.description += r.abilityName+`\n`
                        })
                        embed.footer = {
                            "text": "For more information, search again with one of the listed abilities"
                        }
                        break
                }

                message.channel.send({'embed': embed})
                logger.info(`${message.author.username} searched for ${search}`,{key:'ability'})
            })
        }
    })
}

exports.conf = {
    name: "ability",
    enabled: true
}

exports.help = {
    name: "ability",
    category: "Game",
    shortDesc: "Lookup ability data from Refpedia",
    description: "Lookup ability data from the Reffing Encylopedia. Will return a list of partial matches, or full data for an exact match.",
    usage: `
!ability <search>    Search for ability(s) with a match to
                     the <search> parameter`
}