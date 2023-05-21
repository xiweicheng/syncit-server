const io = require("socket.io-client");

// const socket = io('ws://localhost:3000');

const socket = io("http://localhost:3000?role=io&uid=yyy", { transports: ["websocket"] });

socket.on("connect", () => {
    // either with send()
    console.log('io connected.');
    socket.send(JSON.stringify({ data: 123 }));
});

// handle the event sent with socket.send()
socket.on("message", data => {
    console.log(data);
});

socket.on("disconnect", (reason) => {
    console.log('io disconnected.', reason);
});