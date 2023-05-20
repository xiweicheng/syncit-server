const ws = require('ws');
const wurl = require('wurl');
var _ = require('lodash');

const wsServer = new ws.Server({ noServer: true });

const sockets = {}; // 保存全部建立的长连接

wsServer.on('connection', (socket, request) => {

    console.log(`socket connected. ${request.url}`);

    console.log(socket, request);

    // url: '/?role=embed&uid=7c3d94491a'
    const role = wurl('?role', request.url); // 同屏端角色：embed or app
    const uid = wurl('?uid', request.url); // 发起一次同屏的唯一标识（可以理解为同屏房间号）

    // console.log(role, uid);

    if (!!role && !!uid) {
        socket.t_role = role;
        socket.t_uid = uid;
        const sid = role + '-' + uid;
        socket.t_sid = sid;
        sockets[sid] = socket;
    }

    socket.on('message', (data, isBinary) => {
        // console.log(data.toString());
        // const msg = JSON.parse(data.toString());

        _.each(sockets, (s, sid) => {
            // console.log(s, sid);
            // 同屏对端互转消息（在一个房间号中，通过角色区分发送）
            if (s.t_role !== socket.t_role &&  s.t_uid === socket.t_uid) {
                s.send(data.toString());
            }
        });
    });

    socket.on('close', (code, reason) => {
        console.log(`socket closed. ${code} ${reason}`);
        // sockets[socket.t_sid] = null;
        delete sockets[socket.t_sid];
    });
});

module.exports = wsServer;


