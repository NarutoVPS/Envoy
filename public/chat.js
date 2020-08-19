const socket = io()

const msg = document.getElementById("msg")
const sendBtn = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')

sendBtn.addEventListener("submit", e => {
    e.preventDefault()
    const data = msg.value
    socket.emit('msgFromUser', data)

    sendBtn.reset()
})

socket.on('msgFromServer', data => {
    // console.log(data)

    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

function displayMsg(msg) {
    const div = document.createElement('article')
    div.classList.add('message')
    div.classList.add('is-info')

    div.innerHTML = `                        <div class="message-header">
    <p>About Us</p>
  </div>
  <div class="message-body">
    ${msg}
  </div>`

  chatBox.appendChild(div);
}