const asyncHandler = require("express-async-handler")
const User = require("../models/user.model")

const client = require("../config/mongo.config")

/*
 *  GET Methods 
 */

const getImages = asyncHandler(async (req,res) => {
    const { id } = req.query
    if (!id) {
        res.status(400)
        throw new Error("Empty field")
    }
    const db = await client.connect()

    const users = await db.collection("users")
    const result = await users.find({ _id: id }).toArray()
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result.images)
    }
})

/*
 *  DELETE Methods 
 */

const deleteImage = asyncHandler(async (req,res) => {
    const { userId, imageId } = req.body
    if (!(userId && imageId)){
        res.status(400)
        throw new Error("Empty field")
    }
    const db = await client.connect()

    const users = await db.collection("users")
    const result1 = await users.find({ _id: userId })
    if (result1.images.length == 1) {
        res.status(400).json("No images left")
    } else {
        const result2 = await users.updateOne({ _id: userId }, {
            $pull: { images: { _id:imageId } }
        })
        res.status(200).json(result2)
    }
})

/*
 *  POST Methods 
 */

const addImage = asyncHandler(async (req,res) => {
    const { userId, imageUrl } = req.body
    if (!(userId && imageUrl)){
        res.status(400)
        throw new Error("Empty field")
    }
    const db = await client.connect()
    
    const users = await db.collection("users")
    const result1 = await users.find({ _id: userId })
    if (result1.images.length == 9) {
        res.status(400).json("Too many images!")
    } else {
        const result2 = await users.updateOne({ _id: userId }, {
            $push: { images: { url: imageUrl }}
        })
        res.status(200).json(result2)
    }
})

module.exports = {getImages, deleteImage, addImage}