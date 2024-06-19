#!/usr/bin/env node

const figlet = require("figlet")
const { createSpinner }  = require("nanospinner")
const pm2 = require("pm2")
const fs = require("fs")
const cliConfig = require("../db/cli.json")
const package = require("../package.json")

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function startingMessage() {
    console.clear()

    figlet("MySCL CLI", async (err, data) => {
        if (err) throw err
    
        console.log(data)
        console.log("v" + package.version)
        
        await sleep(2000)

        console.log("\n Welcome new user to the MySCL CLI!")
        
        await sleep(1000)

        const spinner = createSpinner(" Please wait while we are setting things up.").start()

        await sleep(5000)

        spinner.success({ text: "Successfully created database daemon. (This daemon can be found in PM2, or MySCL's CLI)" })
        startDaemon()
    })
}

function startDaemon() {
    pm2.connect((err) => {
        if (err) throw err

        pm2.start({
            script: __dirname + "/server.js",
            name: "db"
        }, (err, apps) => {
            if (err) {
                console.error(err)
                pm2.disconnect()
            }

            pm2.disconnect()
        })
    })
}

if (cliConfig.usedBefore === false) {
    startingMessage()

    let file = JSON.parse(fs.readFileSync(__dirname + "/../db/cli.json", { encoding: "utf8" }))

    file.usedBefore = true

    fs.writeFileSync(__dirname + "/../db/cli.json", JSON.stringify(file), { encoding: "utf8", flag: "w" })
} else {
    const arguments = [process.argv[2], process.argv[3]]

    if (arguments[0] === "list") {
        pm2.list(async (err, list) => {
            if (err) throw err

            let table = []

            list.forEach((process) => {
                table.push({ name: process.name, pid: process.pid, app_id: process.pm_id, cpu: process.monit.cpu, memory: process.monit.memory })
            })

            console.table(table)

            pm2.disconnect()
        })
    } else if (arguments[0] === "start") {
        startDaemon()
        console.log("Successfully started DB daemon.")
    } else if (arguments[0] === "kill" || arguments[0] === "stop") {
        pm2.delete("0", (err) => {
            if (err) throw err
            console.log("Successfully killed DB daemon.")
            pm2.disconnect()
        })
    } else if (arguments[0] === "restart") {
        pm2.connect((err) => {
            if (err) {
                pm2.disconnect()
                throw err
            }

            pm2.restart("0", (err) => {
                if (err) throw err
                
                pm2.disconnect()
            })
        })

        console.log("Successfully restarted DB daemon.")
    } else {
        console.log("Unknown Command.")
    }
}