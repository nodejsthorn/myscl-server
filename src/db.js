const fs = require("fs")

class Database {
    constructor (config) {
        this.config = config
    }

    createCollection(dbname, cname) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            if (fs.existsSync(filepath + "/" + cname)) {
                return { type: "error", message: "Collection '" + cname + "' already exists." }
            } else {
                fs.mkdirSync(filepath + "/" + cname)
                return undefined
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
    }

    createDB(dbname) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            return { type: "error", message: "Database '" + dbname + "' already exists." }
        } else {
            fs.mkdirSync(filepath)
            return undefined
        }
    }

    deleteDB(dbname) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            fs.rmSync(filepath, { recursive: true })
            return undefined
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
    }

    deleteCollection(dbname, cname) {
        let filepath = __dirname + "/../db/" + dbname
        
        if (fs.existsSync(filepath)) {
            if (fs.existsSync(filepath + "/" + cname + "/")) {

                fs.rmSync(filepath + "/" + cname + "/", { recursive: true })
                return undefined
            } else {
                return { type: "error", message: "Collection '" + cname + "' doesn't exist." }
            }
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
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

    findMany(dbname, cname, search) {
        let filepath = __dirname + "/../db/" + dbname
        let result

        if (fs.existsSync(filepath)) {
            if (!fs.existsSync(filepath + "/" + cname)) {
                return { type: "error", message: "Collection '" + cname + "' doesn't exist." }
            } else {
                filepath = filepath + "/" + cname + "/" + cname + ".json"

                if (fs.existsSync(filepath)) {
                    let file = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }))

                    function find(array, searchObject) {
                        return array.filter(obj => {
                            return Object.keys(searchObject).every(key => 
                                obj.hasOwnProperty(key) && obj[key] === searchObject[key]
                            )
                        })
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

    readAllCollections(dbname) {
        let filepath = __dirname + "/../db/" + dbname

        if (fs.existsSync(filepath)) {
            const files = fs.readdirSync(filepath)
            const collections = files.filter(file => fs.statSync(file).isDirectory())

            return collections
        } else {
            return { type: "error", message: "Database '" + dbname + "' doesn't exist." }
        }
    }

    readAllDatabases() {
        let filepath = __dirname + "/../db/"

        const files = fs.readdirSync(filepath)
        const databases = files.filter(file => fs.statSync(file).isDirectory())

        return databases
    }
}

module.exports = { Database }