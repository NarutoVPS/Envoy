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

    socket.on('newUser', user => {
        socket.join(user.room)

        const userName = addUser(socket.id, xss(user.userName), user.room)
        socket.to(user.room).broadcast.emit('msgFromServer', {msg: `${userName} has joined the chat.`, userName: "BOT", time: getTime()})

        io.to(user.room).emit('updateActiveUser', users[user.room])
        if (Object.keys(users).length === 2) {
            socket.emit('msgFromServer', {msg: "Looks like you are alone.<br>Invite some friends to chat 😉", userName: "BOT", time: getTime()})
        }
    })

    socket.on('msgFromUser', data => {
        data["time"] = getTime()
        data['msg'] = xss(data.msg)
        data['userName'] = getUser(data.id, data.room)
        io.to(data.room).emit('msgFromServer', data)
    })

    socket.on('disconnecting', () => {
        const room = Object.keys(socket.rooms)[1]
        const userName = getUser(socket.id, room)
        try {
            delete users[room][socket.id]
        }
        catch {

        }
        
        io.to(room).emit('msgFromServer', {msg: `${userName} has left the chat.`, userName: "BOT", time: getTime()})
        io.to(room).emit('updateActiveUser', users[room])
    })
})

users = {"Programming": {69: "BOT"}, "Jokes": {69: "BOT"}, "Random": {69: "BOT"}}

function addUser(id, userName, room) {
    try {
        if (userName.trim() === "BOT" || userName.trim() === "") {
            users[room][id] = id;
        }
        else {
            users[room][id] = userName
        }
        return users[room][id]
    }
    catch {
        return "🤨"
    }
}

function getUser(id, room) {
    try {
        return users[room][id]
    }
    catch {
        return "🤨"
    }
    
}

function getTime() {
    return moment().calendar()
}
