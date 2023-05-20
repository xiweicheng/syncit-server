const ws = require('ws');
const wurl = require('wurl');
var _ = require('lodash');

const wsServer = new ws.Server({ noServer: true });

const sockets = {};

wsServer.on('connection', (socket, request) => {

    console.log(`socket connected. ${request.url}`);

    // console.log(socket, request);

    // url: '/?page=embed'
    const page = wurl('?page', request.url);
    // console.log(page);

    if (!!page) {
        socket.page = page;
        sockets[page] = socket;
    }

    socket.on('message', (data, isBinary) => {
        console.log(data.toString());
        const msg = JSON.parse(data.toString());

        _.each(sockets, (v, k) => {
            // console.log(v, k);
            if (v.page !== socket.page) {
                v.send(data.toString());
            }
        });
    });

    // socket.send('123');

    socket.on('close', (code, reason) => {
        console.log(`socket closed. ${code} ${reason}`);
        // sockets[socket.page] = null;
        delete sockets[socket.page];
    });
});

module.exports = wsServer;


