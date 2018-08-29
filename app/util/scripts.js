/* 
 * This pretty much only exists because I wanted a way to keep other files
 * tidy and free from large blocks of text. They'll all be in here instead.
 */

module.exports = {
    guildMemberAdd: {
        "title": "Getting Started",
        "description": "Welcome to the server! Interested in playing? You'll find everything you need to get started here. Just here to check it out? That's okay, too! Take your time and explore the game at your own pace.",
        "url": "https://pokemonurpg.com/general/getting-starded/",
        "color": 192537,
        "thumbnail": {
            "url": "https://pokemonurpg.com/img/info/general/urpg-logo-large.png"
        },
        "author": {
            "name": "Pokemon URPG",
            "url": "https://pokemonurpg.com/",
        },
        "footer": {
            "text": "For a full list of this bot's commands, type !help"
        },
    },
    starter: {
        confirm: (p) => {
            return {
                "embed": {
                    "title": `You've selected ${p.displayName}${p.formName ? " ("+p.formName+")" : ""}!`,
                    "description": `In URPG, we have no four-move limit, so ${p.displayName} will start with all of the moves that it can learn level up. You can see a full list of ${p.displayName}’s moves here, on its [URPG Dex page](https://pokemonurpg.com/pokemon/${p.speciesName}).
                
Is this the Pokemon that you want to start with?
Click :white_check_mark: to confirm your choice, or :x: to cancel and choose something else`,
                    "thumbnail": {
                        "url": `https://pokemonurpg.com/img/models/${p.dexNumber}${p.speciesName.indexOf('Alola') > 0 ? "-alola" : ""}.gif`
                    },
                }
            }
        },
        mart: "mart",
        illegal: (p) => {
            return {
                "embed": {
                    "title": `Oops! ${p.displayName}${p.formName ? " ("+p.formName+")" : ""} is an invalid selection.`,
                    "description": `It looks like you’ve chosen a starter that either doesn’t evolve, is already an evolved form, or is on our exception list:

Dratini, Larvitar, Bagon, Kabuto, Omanyte, Scyther, Lileep, Anorith, Beldum, Porygon, Gible, Shieldon, Cranidos, Munchlax, Riolu, Tirtouga, Archen, Deino, Larvesta, Amaura, Tyrunt, Goomy.
                    
Remember that the Pokemon must be able to evolve and must not be on the above list to be chosen as a starter.`
                }
            }
        },
        multimatch: (name, list) => {
            return `Multiple legal starter Pokemon matching "${name}" were found. Please request again with one of the below:
${list.join('\n')}`
        }
    }
}