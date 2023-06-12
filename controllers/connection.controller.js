const asyncHandler = require("express-async-handler")
const uuid = require("uuid")

const client = require("../config/mongo.config")

const getAll = asyncHandler(async (req,res) => {
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const connection = await db.collection("connections")
    
    const result = await connection.find({ status: { $eq: "Match" } }).toArray()
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
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const connection = await db.collection("connections")
    const result = await connection.find({ from_user: id, status: { $eq: "Match" } }).toArray()
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
    const conne = await client.connect()
    const db = conne.db("ta_mongo")

    const conn = await db.collection("connections")
    const connection = await conn.insertOne({
        match_id: uuid.v4(),
        from_user,
        to_user,
        status
    })
    if (status == "Like"){
        const check = await conn.find({ from_user: to_user, to_user: from_user }).toArray()
        if (check.length > 0 && check[0].status == "Like") {
            const match_id = uuid.v4()
            const chat1 = await conn.insertMany([{
                match_id,
                from_user,
                to_user,
                status: "Match"
            },{
                match_id,
                to_user,
                from_user,
                status: "Match"
            }])
        }
    }
    res.status(200).json(connection)
})

const getSpecificConnection = asyncHandler(async (req,res) => {
    const {from_user, to_user} = req.query
    const conn = await client.connect()
    const db = conn.db("ta_mongo")
    
    const connection = await db.collection("connections").find({ from_user, to_user }).toArray()
    res.status(200).json(connection)
})

module.exports = { getAllMatch, addConnection, getAll, getSpecificConnection }