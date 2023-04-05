const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    chat_id:  {
        type: String,
        required: true
    },
    user_id: [String]
}, {
    timestamps: true
})

module.exports = mongoose.model("Chat", chatSchema)