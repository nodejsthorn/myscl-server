const fs = require("fs")

class Database {
    constructor (config) {
        this.config = config
    }

    createCollection(dbname, name) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            if (fs.existsSync(filepath + "/" + name)) {
                return { type: "error", message: "Collection '" + name + "' already exists/doesn't exist." }
            } else {
                fs.mkdirSync(filepath + "/" + name)
                return undefined
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
    }

    createDB(name) {
        let filepath = __dirname + "/../db/" + name

        if (fs.existsSync(filepath)) {
            return { type: "error", message: "Database '" + name + "' already exists/doesn't exist." }
        } else {
            fs.mkdirSync(filepath)
            return undefined
        }
    }

    insert(dbname, cname, value) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            if (!fs.existsSync(filepath + "/" + cname)) {
                return { type: "error", message: "Collection '" + cname + "' doesn't exist." }
            } else {
                filepath = filepath + "/" + cname + "/" + cname + ".json"

                if (fs.existsSync(filepath)) {
                    let file = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }))

                    file.push(value)

                    fs.writeFileSync(filepath, JSON.stringify(file), { encoding: "utf8" })
                } else {
                    fs.writeFileSync(filepath, JSON.stringify([value]), { encoding: "utf8" })
                }

                return undefined
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
    }
}

module.exports = { Database }