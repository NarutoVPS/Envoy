const msg = document.getElementById("msg")
const sendBtn = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const userName = prompt("Enter userName")

sendBtn.addEventListener("submit", e => {
    e.preventDefault()
    const data = {
        msg: msg.value,
        userName: userName
    }
    socket.emit('msgFromUser', data)

    sendBtn.reset()
})

const socket = io()

socket.emit('newUser', userName)

socket.on('msgFromServer', data => {
    // console.log(data)

    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

function displayMsg(data) {
    const div = document.createElement('div')
    div.classList.add('chatMsg')

    div.innerHTML = `<div class="chatMsg">
    <h1 id="userName"><strong>${data.userName}</strong></h1>
    <br>
    <p>${data.msg}</p>
</div>`

  chatBox.appendChild(div);
}