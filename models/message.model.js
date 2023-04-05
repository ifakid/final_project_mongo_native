const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    match_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    message_type: {
        type: String,
        required: true
    },
    attachment_url: {
        type: String
    },
    timestamp: {
        type: Date,
        default: new Date(Date.now())
    }
})

module.exports = mongoose.model("Message", messageSchema)