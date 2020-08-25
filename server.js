const express = require('express')
const app = express()
const socket = require('socket.io')
const PORT = process.env.PORT || 8080
const moment = require('moment')
const xss = require('xss')

// serve the "public" folder to the clients
app.use(express.static("public"))

// setup a server that listens on the specified PORT
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

const io = socket(server)

// when a new clients connects
io.on('connection', socket => {
    // emit welcome msg to only newly connected client
    socket.emit('msgFromServer', {msg: "Welcome to Envoy Messenger!", userName: "BOT", time: getTime()})

    // emit the assigned id to newly connected client
    socket.emit('userId', socket.id)

    // when the newly connected client emits its details 
    socket.on('newUser', user => {
        // join the client to the selected room
        socket.join(user.room)

        // add the client to the list of clients/users
        const userName = addUser(socket.id, xss(user.userName), user.room)
        // emit the joining msg to all the users in the same room
        socket.to(user.room).broadcast.emit('msgFromServer', {msg: `${userName} has joined the chat.`, userName: "BOT", time: getTime()})

        // emit the updated users list of the respective room to all users of the same room
        io.to(user.room).emit('updateActiveUser', users[user.room])
        // if the room has only 1 user excluding the BOT, then emit the warning msg to the client in that room
        if (Object.keys(users[user.room]).length === 2) {
            socket.emit('msgFromServer', {msg: "Looks like you are alone.<br>Invite some friends to chat or join another Room 😉", userName: "BOT", time: getTime()})
        }
    })

    // get the msg data sent by the client, add and update the contents and emit the msg to all clients in that room
    socket.on('msgFromUser', data => {
        data["time"] = getTime()  // add time
        data['msg'] = xss(data.msg) // filter msg text
        data['userName'] = getUser(data.id, data.room) // update the username
        io.to(data.room).emit('msgFromServer', data) // emit the msg to all users of that room
    })

    // when a client is disconnecting
    socket.on('disconnecting', () => {
        // get the client's room & username
        const room = Object.keys(socket.rooms)[1]
        const userName = getUser(socket.id, room)
        try {
            // remove the client detail from the clients data
            delete users[room][socket.id]
        }
        catch {

        }
        
        // emit the leaving msg to all users in that room
        io.to(room).emit('msgFromServer', {msg: `${userName} has left the chat.`, userName: "BOT", time: getTime()})
        // emit the updated users list of the respective room to all users of the same room 
        io.to(room).emit('updateActiveUser', users[room])
    })
})

// dictionary that contails the details of all the connected clients
users = {"Default": {69: "BOT"}, "Programming": {69: "BOT"}, "Jokes": {69: "BOT"}, "Random": {69: "BOT"}}

// adds the new user to "users" dict
function addUser(id, userName, room) {
    try {
        // check if the client userName is "BOT" or blank
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

// returns userName of a user given its id & room name
function getUser(id, room) {
    try {
        return users[room][id]
    }
    catch {
        return "🤨"
    }
    
}

// returns current UTC time
function getTime() {
    return moment().calendar()
}
