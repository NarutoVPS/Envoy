const moment = require('moment')

// dictionary that contails the details of all the connected clients
const users = {"Default": {69: "BOT"}, "Programming": {69: "BOT"}, "Jokes": {69: "BOT"}, "Random": {69: "BOT"}}

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

module.exports = {
    users,
    addUser,
    getUser,
    getTime
}
