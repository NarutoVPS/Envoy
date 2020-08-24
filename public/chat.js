const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const activeUsers = document.querySelector('.activeUsers')
const activeUsersMobile = document.querySelector('.users-menu')
const tone = document.getElementById("myAudio"); 
const {userName, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
var currentUserId = ''

const socket = io()

socket.emit('newUser', {userName, room})

socket.on('userId', id => {
    currentUserId = id;
})

socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('updateActiveUser', data => {
    addActiveUser(data)
    addActiveUsersMobile(data)
})

function displayMsg(data) {
    if (data.userName !== 'undefined' && data.msg.trim() !== "") {
        const div = document.createElement('div')
        div.classList.add('chatMsg')
        const tempDiv = document.createElement('div')

        div.innerHTML = `<div id="userName">${tempDiv.textContent = data.userName} <div class="time"> ${tempDiv.textContent = data.time.toString()}</div></div>
        <br>
        <div class="message">${tempDiv.textContent = data.msg}</div>`
    
      chatBox.appendChild(div);
      if (currentUserId !== data.id) {
        playAudio()
      }
    }
}

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

function playAudio() { 
    tone.play(); 
}

form.addEventListener("submit", e => {
    e.preventDefault()
    const data = {
        msg: msg.value,
        userName: userName,
        id: currentUserId,
        room: room
    }
    socket.emit('msgFromUser', data)
    form.reset()
})

const onlineUser = document.querySelector('.mobile-users')
const userMenu = document.querySelector('.users-menu')

onlineUser.addEventListener('click', () => {
    userMenu.classList.toggle('visible')
})
