const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const userName = prompt("Enter userName")

form.addEventListener("submit", e => {
    e.preventDefault()
    const data = {
        msg: msg.value,
        userName: userName
    }
    socket.emit('msgFromUser', data)
})

const socket = io()

socket.emit('newUser', userName)

socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

function displayMsg(data) {
    const div = document.createElement('div')
    div.classList.add('chatMsg')

    div.innerHTML = `<h1 id="userName"><strong>${data.userName} ${Date(data.time).toString().split(' ')[4]}</strong></h1>
    <br>
    <p>${data.msg}</p>`

  chatBox.appendChild(div);
}