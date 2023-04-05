const asyncHandler = require("express-async-handler")
const Message = require("../models/message.model")

const getAll = asyncHandler(async (req,res) => {
    const result = await Message.find()
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

const getAllFromMatch = asyncHandler(async (req,res) => {
    const { matchid } = req.params
    const result = await Message.find({ match_id: matchid })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

const sendMessage = asyncHandler(async (req,res) => {
    const { match_id, attachment_url, message_type, sender_id, body } = req.body
    if (!(match_id && message_type && sender_id)) {
        res.status(400)
        throw new Error("Empty field")
    }
    const message = await Message.create({
        match_id, 
        attachment_url, 
        message_type, 
        sender_id, 
        timestamp: new Date(Date.now()),
        body
    })
    res.status(200).json(message)
})

module.exports = { getAll, getAllFromMatch, sendMessage }