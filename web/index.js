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
    const m1 = { stepPin: 12, dirPin: 11, event: 'motor1:step' };
    const m2 = { stepPin: 10, dirPin: 9,  event: 'motor2:step' };
    const motor1 = new Motor(m1.stepPin, m1.dirPin);
    const motor2 = new Motor(m2.stepPin, m2.dirPin);
    let idConnected = ""; // holds the ID of the active room...

    io.on('connection', socket => {
        if (!idConnected) idConnected = socket.id;  // if first connection, save the room ID
        else socket.disconnect();   // disconnect every subsequent request which does not match
        console.log(socket.id, 'connected:', socket.connected, 'at', socket.conn.remoteAddress);

        socket.on(m1.event, (data) => {
            console.log(socket.id, m1.event, data);
            if (data === 'cw') motor1.step(1);
            if (data === 'ccw') motor1.step(-1);
        });

        socket.on(m2.event, (data) => {
            console.log(socket.id, m2.event, data);
            if (data === 'cw') motor2.step(1);
            if (data === 'ccw') motor2.step(-1);
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