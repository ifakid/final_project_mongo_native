const asyncHandler = require("express-async-handler")

const { ObjectId } = require("mongodb")

const client = require("../config/mongo.config")

const addReport = asyncHandler(async (req,res) => {
    const { reportedBy, reportedItem, reportType, details } = req.body
    if (!(reportType && reportedBy)) {
        res.status(400)
        throw new Error("Field required")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const reports = await db.collection("reports")
    const report = await reports.insertOne({
        reportedBy,
        reportedItem,
        reportType,
        details,
        resolved: false
    })
    res.status(200).json(report)
})

const getReport = asyncHandler(async (req,res) => {
    var { resolved, page, count } = req.query
    let query = {}
    if (resolved) {
        query.resolved = Boolean(resolved)
    }
    if (!page) page = 1
    if (!count) count = 20

    const conn = await client.connect()
    const db = conn.db("ta_mongo")

    const reports = await db.collection("reports")
    const result = await reports.find(query).skip((page-1)*count).limit(count).toArray()
    res.status(200).json({ "reports": result })
})

const markAsResolved = asyncHandler(async (req,res) => {
    const { id } = req.body
    if (!id) {
        res.status(400)
        throw new Error("Field required")
    }
    const conn = await client.connect()
    const db = conn.db("ta_mongo")
    
    const reports = await db.collection("reports")
    const result = await reports.updateOne({ _id: new ObjectId(id) }, { $set: { resolved: true } })
    if (!result){
        res.status(404).json("Not found")
    } else {
        res.status(200).json(result)
    }
})

module.exports = { addReport, getReport, markAsResolved }