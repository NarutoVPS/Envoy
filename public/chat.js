const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const activeUsers = document.querySelector('.activeUsers')
const activeUsersMobile = document.querySelector('.users-menu')
const tone = document.getElementById("myAudio"); 
var {userName, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
var currentUserId = ''

const socket = io()

// checks for invalid room name
checkDetails()

// when a new user joins, emit a msg to the server with username & room
socket.emit('newUser', {userName, room})

// save the current user id emitted by the server
socket.on('userId', id => {
    currentUserId = id;
})

// add an event listener to the form so that each time user submits any msg, the details are emitted to the server
form.addEventListener("submit", e => {
    e.preventDefault() // prevents from reloading the page after submission
    const data = {
        msg: msg.value,
        userName: userName,
        id: currentUserId,
        room: room
    }
    socket.emit('msgFromUser', data)
    form.reset()
})

socket.on('previousMsg', data => {
    data.forEach(msg => {
        displayMsg(msg)
    })
    chatBox.scrollTop = chatBox.scrollHeight;
})

// get the msg emitted by the server and display it
socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight; // scroll to the bottom after a msg is received
})

// update the online users list with the data sent by the server
socket.on('updateActiveUser', data => {
    addActiveUser(data)
    addActiveUsersMobile(data)
})

// displays the msg to each users in the room
function displayMsg(data) {
    // check if the username is undefined or if the msg is blank
    if (data.userName !== 'undefined' && data.msg.trim() !== "") {
        const div = document.createElement('div')
        div.classList.add('chatMsg')
        const tempDiv = document.createElement('div')

        // add the msg (Date needs to be converted to local timezone from UTC)
        div.innerHTML = `<div id="userName">${tempDiv.textContent = data.userName} <div class="time"> ${tempDiv.textContent = Date(data.time).toString().split(' ')[4]}</div></div>
        <br>
        <div class="message">${tempDiv.textContent = data.msg}</div>`
    
      chatBox.appendChild(div);
      // play the msg tone if the msg hasn't been sent by the same client
      if (currentUserId !== data.id) {
        playAudio()
      }
    }
}

// updates the list of online users (for mobile device)
function addActiveUsersMobile(data) {
    const div = document.createElement('div')
    const tempDiv = document.createElement('div')
    div.innerHTML = ""
    for (let eachUser in data) {
        div.innerHTML += `
            <div class="user-tag">
            <svg class="users-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17 11v3l-3-3H8a2 2 0 01-2-2V2c0-1.1.9-2 2-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-1zm-3 2v2a2 2 0 01-2 2H6l-3 3v-3H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 004 4h6z"/></svg>
            <div class="user-name">
            ${tempDiv.textContent = data[eachUser]}
        </div>
        </div>
        `
    }
    activeUsersMobile.innerHTML = ''
    activeUsersMobile.appendChild(div)
}

// updates the list of online users (for non-mobile device)
function addActiveUser(data) {
    const li = document.createElement('li')
    const tempDiv = document.createElement('div')
    li.innerHTML = ""
    for (let eachUser in data) {
        li.innerHTML += `
        <div class="user-slot"><svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17 11v3l-3-3H8a2 2 0 01-2-2V2c0-1.1.9-2 2-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-1zm-3 2v2a2 2 0 01-2 2H6l-3 3v-3H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 004 4h6z"/></svg><div class="my-user">${tempDiv.textContent = data[eachUser]}</div></div>`
    }
    activeUsers.innerHTML = ''
    activeUsers.appendChild(li)
}

// plays the msg tone when called
function playAudio() { 
    tone.play(); 
}

const onlineUser = document.querySelector('.mobile-users')
const userMenu = document.querySelector('.users-menu')

// an event listener which shows/hides the online users list (for mobile device)
onlineUser.addEventListener('click', () => {
    userMenu.classList.toggle('visible')
})

// checks if the room name is invalid
function checkDetails() {
    if (typeof(["Programming", "Jokes", "Random", "Default"].find(e => e === room)) === "undefined") {
        room = "Random"
        alert("🤬🤬🤬")
    }
}
