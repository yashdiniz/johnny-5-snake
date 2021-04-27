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
    let connected = false;

    io.on('connection', socket => {
        socket.on('motor1:step', (data) => {
            console.log('motor1:step', data);
            if (data === 'cw') motor1.step(1);
            if (data === 'ccw') motor1.step(-1);
        });
        socket.on('hey', (data) => {
            if (!connected) connected = true;
            else socket.close();
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