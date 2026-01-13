const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
let clients = new Map(); 

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  ws.send(JSON.stringify({
    type: "notification",
    text: "Please send your username"
  }));

  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === "join") {
      clients.set(ws, data.user);

      broadcast({
        type: "notification",
        text: `${data.user} joined the chat`
      });

      return;
    }
    if (data.type === "message") {
      const username = clients.get(ws);

      broadcast({
        type: "message",
        user: username,
        text: data.text
      });
    }
  });
  ws.on("close", () => {
    const username = clients.get(ws);
    clients.delete(ws);

    if (username) {
      broadcast({
        type: "notification",
        text: `${username} left the chat`
      });
    }
  });
});
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
