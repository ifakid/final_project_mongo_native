const asyncHandler = require("express-async-handler")

const client = require("../config/mongo.config")

const getAll = asyncHandler(async (req,res) => {
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const messages = await db.collection("messages")
    const result = await messages.find({}).toArray()
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

const getAllFromMatch = asyncHandler(async (req,res) => {
    const { matchid } = req.params
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const messages = await db.collection("messages")
    const result = await messages.find({ match_id: matchid }).toArray()
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
    const conn = await client.connect()
    const db = conn.db("ta_mongo")
    
    const messages = await db.collection("messages")
    const message = await messages.insertOne({
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