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

    insertOne(dbname, cname, value) {
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

    insertMany(dbname, cname, value) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            if (!fs.existsSync(filepath + "/" + cname)) {
                return { type: "error", message: "Collection '" + cname + "' doesn't exist." }
            } else {
                filepath = filepath + "/" + cname + "/" + cname + ".json"

                if (fs.existsSync(filepath)) {
                    let file = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }))

                    value.forEach((v) => {
                        file.push(v)
                    })

                    fs.writeFileSync(filepath, JSON.stringify(file), { encoding: "utf8" })
                } else {
                    fs.writeFileSync(filepath, JSON.stringify(value), { encoding: "utf8" })
                }

                return undefined
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        } 
    }

    findOne(dbname, cname, search) {
        let filepath = __dirname + "/../db/" + dbname
        let result

        if (fs.existsSync(filepath)) {
            if (!fs.existsSync(filepath + "/" + cname)) {
                return { type: "error", message: "Collection '" + cname + "' doesn't exist." }
            } else {
                filepath = filepath + "/" + cname + "/" + cname + ".json"

                if (fs.existsSync(filepath)) {
                    let file = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }))

                    function find(arr, search) {
                        return arr.find(item => 
                            Object.keys(search).every(key => item[key] === search[key])
                        )
                    }

                    result = find(file, search)
                } else {
                    return { type: "error", message: "Collection document file '" + cname + "' doesn't exist. (THIS IS MOST LIKELY A SERVER ISSUE)" }
                }
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
        
        if (result) {
            return result
        }
    }
}

module.exports = { Database }