const asyncHandler = require("express-async-handler")
const uuid = require("uuid")

const Connection = require("../models/connection.model")
const Chat = require("../models/chat.model")

const getAll = asyncHandler(async (req,res) => {
    const result = await Chat.find({ })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json({"connections": result})
    }
})

const getAllMatch = asyncHandler(async (req,res) => {
    const { id } = req.query
    if (!id) {
        res.status(400)
        throw new Error("Empty field")
    }
    const result = await Connection.find({ from_user: id })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json({"connections": result})
    }
})

const addConnection = asyncHandler(async (req,res) => {
    const {from_user, to_user, status} = req.body
    if (!(from_user && to_user && status)) {
        res.status(400)
        throw new Error("Empty field")
    }
    const connection = await Connection.create({
        from_user,
        to_user,
        status
    })
    if (status == "Like"){
        const check = await Connection.find({ from_user: to_user, to_user: from_user })
        if (check.length > 0 && check[0].status == "Like") {
            /*const chat = await Chat.create({
                chat_id: uuid.v4(),
                user_id: [ from_user, to_user ]
            })*/
            const match_id = uuid.v4()
            const chat1 = await Connection.create({
                match_id,
                from_user,
                to_user,
                status: "Match"
            })
            const chat2 = await Connection.create({
                match_id,
                to_user,
                from_user,
                status: "Match"
            })
        }
    }
    res.status(200).json(connection)
})

const getSpecificConnection = asyncHandler(async (req,res) => {
    const {from_user, to_user} = req.query
    const connection = await Connection.find({ from_user, to_user })
    res.status(200).json(connection)
})

module.exports = { getAllMatch, addConnection, getAll, getSpecificConnection }