// utils/socket.js
let socket: any;

export function connectWebSocket(onMessage: any) {
  socket = new WebSocket('ws://localhost:8000/ws');  // ⬅ 這裡改成你的後端 URL

  socket.onmessage = (event: any) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
}

export function sendMessage(data: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}
