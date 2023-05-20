const WebSocket = require('ws');
// console.log(WebSocket);

const ws = new WebSocket('ws://localhost:3000/?page=test');

ws.on('error', console.error);

ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data) {
  //console.log(`Round-trip time: ${Date.now() - data} ms`);

  console.log(data);

  setTimeout(function timeout() {
    ws.send(Date.now());
  }, 500);
});