const express = require('express')
const path = require('path')
const app = express()
const { Motor } = require('../index')

var server = require('http').createServer(app)
var io = require('socket.io')(server, {
    cors: true,
    origins: ["http://localhost:8080"],
});

const { Board } = require('johnny-five');
const board = new Board();

board.on("ready", () => {
    console.log('Board ready');
    const motor1 = new Motor(12, 11);
    let idConnected = ""; // holds the ID of the active room...

    io.on('connection', socket => {
        if (!idConnected) idConnected = socket.id;  // if first connection, save the room ID
        else socket.disconnect();   // disconnect every subsequent request which does not match
        console.log(socket.id, 'connected:', socket.connected, 'at', socket.conn.remoteAddress);

        socket.on('motor1:step', (data) => {
            console.log(socket.id, 'motor1:step', data);
            if (data === 'cw') motor1.step(1);
            if (data === 'ccw') motor1.step(-1);
        });

        socket.on('disconnect', () => {
            // if the connected room is closing, forget the connection
            if(socket.id === idConnected) idConnected = "";
            console.log(socket.id, 'attempted to close connection at', socket.conn.remoteAddress);
        });
    });

    app.get('/', (req, res) => {
        const p = path.join(__dirname, 'index.html');
        res.sendFile(p);
    });

    server.listen(8080, () => {
        console.log('Listening now');
    });
});