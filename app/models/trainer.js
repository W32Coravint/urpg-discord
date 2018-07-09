const mongoose = require('mongoose')
const Schema = mongoose.Schema

var trainerSchema = new Schema({
    discord_id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    cash: { type: Number, required: true, default: 10000 },
    joinDate: { type: Date, required: true, default: Date.now },
    battleRecord: { 
        wins: { type: Number, default: 0 }, 
        losses: { type: Number, default: 0 } 
    }
})

module.exports = mongoose.model('Trainer', trainerSchema)