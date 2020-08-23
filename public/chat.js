const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const activeUsers = document.querySelector('.activeUsers')
const tone = document.getElementById("myAudio"); 
const {userName} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
var currentUserId = ''

const socket = io()

socket.emit('newUser', userName)

socket.on('userId', id => {
    currentUserId = id;
})

socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('updateActiveUser', data => {
    addActiveUser(data)
})

function displayMsg(data) {
    if (data.userName !== 'undefined' && data.msg !== "") {
        const div = document.createElement('div')
        div.classList.add('chatMsg')
        const tempDiv = document.createElement('div')

        div.innerHTML = `<div id="userName">${tempDiv.textContent = data.userName} <div class="time"> ${tempDiv.textContent = Date(data.time).toString().split(' ')[4]}</div></div>
        <br>
        <div class="message">${tempDiv.textContent = data.msg}</div>`
    
      chatBox.appendChild(div);
      if (currentUserId !== data.id) {
        playAudio()
      }
    }
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
        id: currentUserId
    }
    socket.emit('msgFromUser', data)
    form.reset()
})
