const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { Cache } = require("./cache.js")
const { Database } = require("./db.js")
const config = require("../db/config.json")
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = new Database(config)
const cache = new Cache(config)

function message(response) {
    return "\u001b[34m" + "myscl: " + "\u001b[0m" + response
}

app.post("/db", (req, res) => {
    if (req.body.type === "writeCache") {
        cache.setCache(req.body.key, req.body.value)
        res.json({ type: "success", key: req.body.key, value: req.body.value })
    } else if (req.body.type === "readAllCache") {
        res.json(cache.getAllCache())
    } else if (req.body.type === "deleteAllCache") {
        res.json(cache.deleteAllStoredCache())
    } else if (req.body.type === "deleteCache") {
        res.json(cache.deleteCache(req.body.key))
    } else if (req.body.type === "getCache") {
        res.json(cache.getCache(req.body.key))
    } else if (req.body.type === "createDB") {
        const data = db.createDB(req.body.name)
        res.json(data)

        if (typeof data != "object") {
            console.log(message("Created database '" + req.body.name + "'."))
        }
    } else if (req.body.type === "createCollection") {
        const data = db.createCollection(req.body.dbname, req.body.name)
        res.json(data)

        if (typeof data != "object") {
            console.log(message("Created collection '" + req.body.name + "' in database '" + req.body.dbname + "'."))
        }
    } else if (req.body.type === "insertOne") {
        res.json(db.insert(req.body.dbname, req.body.cname, req.body.value))
    } else {
        res.json({ type: "error", message: "Unknown request type." })
    }
})

const port = config.port || 8000

app.listen(port, () => console.log(message("Listening at port " + port + ".")))