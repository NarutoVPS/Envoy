const express = require('express')
const app = express()
const socket = require('socket.io')
const PORT = process.env.PORT || 8080

app.use(express.static("public"))

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

const io = socket(server)

io.on('connection', socket => {
    // console.log("Connection Established")
    socket.emit('msgFromServer', {msg: "Welcome to Envoy Messenger!", userName: "BOT"})

    // socket.broadcast.emit('msgFromServer', )

    socket.on('msgFromUser', data => {
        // console.log(data)
        io.emit('msgFromServer', data)
    })
})