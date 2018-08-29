const mongoose = require('mongoose')

var abilitySchema = new mongoose.Schema({
    abilityName: String,
    announcement: String,
    desc: String,
    additional: String,
    affects: String
})

abilitySchema.query.exact = function(search) {
    return this.where({ 'abilityName': new RegExp(`^${search}$`, 'i') })
}

abilitySchema.query.partial = function(search) {
    return this.where({ 'abilityName': new RegExp(search, 'i') })
}

module.exports = mongoose.model('Ability', abilitySchema)