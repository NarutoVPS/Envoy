const express = require('express')
const app = express()
const socket = require('socket.io')
const PORT = process.env.PORT || 8080
const moment = require('moment')

app.use(express.static("public"))

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

const io = socket(server)

io.on('connection', socket => {
    socket.emit('msgFromServer', {msg: "Welcome to Envoy Messenger!", userName: "BOT", time: getTime()})
    socket.emit('userId', socket.id)

    socket.on('newUser', userName => {
        addUser(socket.id, userName)
        socket.broadcast.emit('msgFromServer', {msg: `${userName} has joined the chat.`, userName: "BOT", time: getTime()})

        io.emit('updateActiveUser', users)
    })

    socket.on('msgFromUser', data => {
        data["time"] = getTime()
        io.emit('msgFromServer', data)
    })

    socket.on('disconnect', () => {
        const userName = getUser(socket.id)
        delete users[socket.id]
        
        io.emit('msgFromServer', {msg: `${userName} has left the chat.`, userName: "BOT", time: getTime()})
        io.emit('updateActiveUser', users)
    })
})

users = {69: "BOT"}

function addUser(id, userName) {
    users[id] = userName
}

function getUser(id) {
    return users[id]
}

function getCurrentUser(id) {
    for (let each in users) {
        if (each === id) {
            return users[id]
        }
    }
}

function getTime() {
    return moment().format()
}