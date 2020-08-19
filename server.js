const express = require('express')
const app = express()
const socket = require('socket.io')

app.use(express.static("public"))

const server = app.listen(8080, () => {
    console.log("Server Started")
})

const io = socket(server)

io.on('connection', socket => {
    // console.log("Connection Established")

    socket.on('msgFromUser', data => {
        // console.log(data)
        io.emit('msgFromServer', data)
    })
})