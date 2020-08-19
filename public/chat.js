const socket = io()

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

socket.on('msgFromServer', data => {
    // console.log(data)

    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

function displayMsg(data) {
    const div = document.createElement('article')
    div.classList.add('message')
    div.classList.add('is-info')

    div.innerHTML = `                        <div class="message-header">
    <p>${data.userName}</p>
  </div>
  <div class="message-body">
    ${data.msg}
  </div>`

  chatBox.appendChild(div);
}