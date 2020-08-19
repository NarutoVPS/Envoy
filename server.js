const express = require('express')
const app = express()
const socket = require('socket.io')

app.use(express.static("public"))

const server = app.listen(8080, () => {
    console.log("Server Started")
})

const io = socket(server)

io.on('connection', () => {
    console.log("Connection Established")
})