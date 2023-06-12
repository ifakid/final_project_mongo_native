const asyncHandler = require("express-async-handler")
const uuid = require("uuid")

const client = require("../config/mongo.config")

/*
 * GET Methods
 */ 

const getRandom = asyncHandler(async (req,res) => {
    const { id, gender } = req.query
    const longitude = parseFloat(req.query.longitude)
    const latitude = parseFloat(req.query.latitude)
    const distance = parseFloat(req.query.distance)
    const minAge = parseInt(req.query.minAge)
    const maxAge = parseInt(req.query.maxAge)

    const now = new Date(Date.now())

    if (!(id && gender && longitude && latitude)){
        res.status(400)
        throw new Error("Empty field")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const connection = await db.collection("connections")
    const result = await connection.find({ from_user: id }).toArray()
    let result1 = []
    result.forEach(r => result1.push(r.to_user))
    result1.push(id)

    let agg1 = { $geoNear: {
        near: { 
            type: "Point", 
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        distanceField: "distance",
    }}
    let agg2 = { $match: { 
        gender: gender, 
        _id: { $nin: result1 }, 
    }}
    let agg3 = { $sample: { size: 20 } }

    if (distance) {
        agg1["$geoNear"]["maxDistance"] = distance
    }
    if (minAge){
        if (!agg2["$match"]["birthdate"]) {
            agg2["$match"]["birthdate"] = {}
        }
        const min_y = now.getFullYear() - minAge

        agg2["$match"]["birthdate"]["$lt"] = new Date(min_y, now.getMonth(), now.getDate())

    }
    if (maxAge){
        if (!agg2["$match"]["birthdate"]) {
            agg2["$match"]["birthdate"] = {}
        }
        const max_y = now.getFullYear() - maxAge
        agg2["$match"]["birthdate"]["$gte"] = new Date(max_y, now.getMonth(), now.getDate())
    }

    let pipeline = [agg1, agg2, agg3]
   
    const users = await db.collection("users")
    const result2 = await users.aggregate(pipeline).toArray()
    res.status(200).json({"users": result2})
})

const getUser = asyncHandler(async (req,res) => {
    const { id } = req.query
    if (!id) {
        res.status(400)
        throw new Error("Empty field")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const users = await db.collection("users")
    const result = await users.find({ _id: id }).toArray()
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

/*
 * POST Methods
 */ 

const addUser = asyncHandler(async (req,res) => {
    const { about, birthdate, discovery, email, fakultas, gender, jurusan, number, username, longitude, latitude, images } = req.body
    if (!(birthdate && email && fakultas && gender && jurusan && number && username)){
        res.status(400)
        throw new Error("Empty field")
    }

    const coord = [longitude, latitude]
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const users = await db.collection("users")
    const user = await users.insertOne({
        _id: uuid.v4(),
        about,
        birthdate,
        discovery,
        email,
        fakultas,
        gender,
        jurusan,
        number,
        location: {
            type: "Point",
            coordinates: coord
        },
        username, 
        images
    })
    res.status(200).json(user)
})

/*
 * PATCH Methods
 */
 

const editUser = asyncHandler(async (req,res) => {
    const {id, about} = req.body
    if (!(id && about)){
        res.status(400)
        throw new Error("Empty field")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const users = await db.collection("users")
    const result = await users.updateOne({ _id: id }, {
        $set: { about }
    })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

const updateLocation = asyncHandler(async (req,res) => {
    const { id, latitude, longitude } = req.body
    if (!(id && latitude && longitude)) {
        res.status(400)
        throw new Error("Empty field")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")
    
    const users = await db.collection("users")
    const result = await users.updateOne({ _id: id }, {
        $set: {
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }
    })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

module.exports = { addUser, editUser, getRandom, getUser, updateLocation }