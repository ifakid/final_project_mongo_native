const mongoose = require("mongoose")
const uuid = require("uuid")

const connectionSchema = new mongoose.Schema({
    _id:  {
        type: String,
        default: uuid.v4
    },
    from_user: {
        type: String,
        required: true
    },
    to_user: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Connection", connectionSchema)