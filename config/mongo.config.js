const { MongoClient } = require("mongodb");

const url = process.env.DATABASE_URL
console.log(`Database URL: ${url}`)

const client = new MongoClient(url);

module.exports = client;