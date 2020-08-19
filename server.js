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
    socket.emit('msgFromServer', {msg: "Welcome to Envoy Messenger!", userName: "BOT"})

    // socket.broadcast.emit('msgFromServer', )
    socket.on('newUser', userName => {
        addUser(socket.id, userName)
        socket.broadcast.emit('msgFromServer', {msg: `${userName} has joined the chat.`, userName: "BOT"})
    })

    socket.on('msgFromUser', data => {
        // console.log(data)
        io.emit('msgFromServer', data)
    })

    socket.on('disconnect', () => {
        const userName = getUser(socket.id)
        io.emit('msgFromServer', {msg: `${userName} has left the chat.`, userName: "BOT"})
    })
})

users = {}

function addUser(id, userName) {
    users[id] = userName
}

function getUser(id) {
    return users[id]
}