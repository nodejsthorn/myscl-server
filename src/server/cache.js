const NodeCache = require("node-cache")

class Cache {
    constructor (config) {
        this.config = config
        this.cache = new NodeCache()
    }

    setCache(key, value) {
        this.cache.set(key, value)
    }

    deleteAllStoredCache() {
        if (this.config.cacheOptions.cache === false || this.config.cacheOptions.cache === undefined) {
            throw new Error("Cannot run cache. (Check config.json for the 'cache' flag)")
        }

        this.cache.keys().forEach((key) => {
            this.cache.del(key)
        })
    }

    getAllCache() {
        if (this.config.cacheOptions.cache === false || this.config.cacheOptions.cache === undefined) {
            throw new Error("Cannot run cache. (Check config.json for the 'cache' flag)")
        }

        let cacheList = []

        if (this.cache.keys().length === 0) {
            return []
        }

        this.cache.keys().forEach((key) => {
            cacheList.push({key: key, value: this.cache.get(key)})
        })

        return cacheList
    }

    getCache(key) {
        if (this.config.cacheOptions.cache === false || this.config.cacheOptions.cache === undefined) {
            throw new Error("Cannot run cache. (Check config.json for the 'cache' flag)")
        }

        let data

        this.getAllCache().forEach((item) => {
            if (item.key === key) {
                data = item
            }
        })

        return data
    }

    deleteCache(key) {
        if (this.config.cacheOptions.cache === false || this.config.cacheOptions.cache === undefined) {
            throw new Error("Cannot run cache. (Check config.json for the 'cache' flag)")
        }

        this.cache.del(key)

        return { type: "success", key: key }
    }
}

module.exports = { Cache }