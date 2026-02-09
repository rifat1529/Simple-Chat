const socket = new WebSocket(" https://unentreated-estell-unhandily.ngrok-free.dev");

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let username = "";

socket.onopen = () => {
  username = prompt("Enter your name:");

  socket.send(JSON.stringify({
    type: "join",
    user: username
  }));

  chatBox.innerHTML += "<p><i>Connected to server</i></p>";
};
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "message") {
    chatBox.innerHTML += `<p><b>${data.user}:</b> ${data.text}</p>`;
  }
  if (data.type === "notification") {
    chatBox.innerHTML += `<p><i>${data.text}</i></p>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
};
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg === "") return;

  socket.send(JSON.stringify({
    type: "message",
    text: msg
  }));

  messageInput.value = "";
}
