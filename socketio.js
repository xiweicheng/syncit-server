const express = require('express');
const app = express();
var _ = require('lodash');

// var cors = require('cors');
// app.use(cors());

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io"); // https://socket.io/zh-CN/
const io = new Server(server, {
  maxHttpBufferSize: 1e10,
  cors: {}
  // "origin": "*",
  // "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  // "preflightContinue": false,
  // "optionsSuccessStatus": 204
  // }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const sockets = {}; // 保存全部建立的长连接

io.on("connection", socket => {

  console.log(`socket connected.`, socket.handshake.query);

  const role = socket.handshake.query.role; // 同屏端角色：embed or app
  const uid = socket.handshake.query.uid; // 发起一次同屏的唯一标识（可以理解为同屏房间号）

  // console.log(role, uid);

  if (!!role && !!uid) {
    socket.t_role = role;
    socket.t_uid = uid;
    const sid = role + '-' + uid;
    socket.t_sid = sid;
    sockets[sid] = socket;
  }

  // handle the event sent with socket.send()
  socket.on("message", (data) => {
    // console.log(data);
    // const msg = JSON.parse(data);

    _.each(sockets, (s, sid) => {
      // console.log(s, sid);
      // 同屏对端互转消息（在一个房间号中，通过角色区分发送）
      if (s.t_role !== socket.t_role && s.t_uid === socket.t_uid) {
        s.send(data);
      }
    });

  });

  socket.on("disconnect", (reason) => {
    console.log(`socket disconnected. ${socket.t_sid} ${reason}`);
    // sockets[socket.t_sid] = null;
    delete sockets[socket.t_sid];
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});