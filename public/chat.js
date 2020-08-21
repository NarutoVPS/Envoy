const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const activeUsers = document.querySelector('.activeUsers')
const {userName} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(userName)

form.addEventListener("submit", e => {
    e.preventDefault()
    const data = {
        msg: msg.value,
        userName: userName
    }
    socket.emit('msgFromUser', data)
    form.reset()
})

const socket = io()

socket.emit('newUser', userName)

socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('updateActiveUser', data => {
    addActiveUser(data)
})

function displayMsg(data) {
    const div = document.createElement('div')
    div.classList.add('chatMsg')

    div.innerHTML = `<h1 id="userName"><strong>${data.userName} ${Date(data.time).toString().split(' ')[4]}</strong></h1>
    <br>
    <p>${data.msg}</p>`

  chatBox.appendChild(div);
}

function addActiveUser(data) {
    const li = document.createElement('li')
    li.innerHTML = ""
    for (let eachUser in data) {
        li.innerHTML += `<li> <img src="online.png" class="online-logo"> ${data[eachUser]}</li>`
    }
    activeUsers.innerHTML = ''
    activeUsers.appendChild(li)
}
