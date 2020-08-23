const express = require('express')
const app = express()
const socket = require('socket.io')
const PORT = process.env.PORT || 8080
const moment = require('moment')
const xss = require('xss')

app.use(express.static("public"))

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

const io = socket(server)

io.on('connection', socket => {
    socket.emit('msgFromServer', {msg: "Welcome to Envoy Messenger!", userName: "BOT", time: getTime()})
    socket.emit('userId', socket.id)

    socket.on('newUser', userName => {
        userName = addUser(socket.id, xss(userName))
        socket.broadcast.emit('msgFromServer', {msg: `${userName} has joined the chat.`, userName: "BOT", time: getTime()})

        io.emit('updateActiveUser', users)
        if (Object.keys(users).length === 2) {
            socket.emit('msgFromServer', {msg: "Looks like you are alone.<br>Invite some friends to chat 😉", userName: "BOT", time: getTime()})
        }
    })

    socket.on('msgFromUser', data => {
        data["time"] = getTime()
        data['msg'] = xss(data.msg)
        data['userName'] = getUser(data.id)
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
    if (userName.trim() === "BOT" || userName.trim() === "") {
        users[id] = id;
    }
    else {
        users[id] = userName
    }
    return users[id]
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
    return moment().calendar()
}
