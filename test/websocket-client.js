const WebSocket = require('ws');
// console.log(WebSocket);

// const ws = new WebSocket('ws://localhost:3000/?role=ws&uid=xxx');
const ws = new WebSocket('ws://localhost:3000/socket.io/?role=ws&uid=xxx');

ws.on('error', console.error);

ws.on('open', function open() { 
  console.log('connected');
  ws.send(JSON.stringify({ data: 123 }));
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data) {
  console.log(data);
});