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
const board = new Board({
    repl: true,
    timeout: 10000,
});

board.on("ready", () => {
    console.log('Board ready');
    const motor = [ { motor: new Motor(10, 9), event: 'motorA:step' }, 
                    { motor: new Motor(12, 11), event: 'motorB:step' }, 
                    { motor: new Motor(8, 7), event: 'motorC:step' } ];
    let idConnected = ""; // holds the ID of the active room...

    io.on('connection', async socket => {
        if (!idConnected) idConnected = socket.id;  // if first connection, save the room ID
        else socket.disconnect();   // disconnect every subsequent request which does not match
        console.log(new Date(), socket.id, 'connected:', socket.connected, 'at', socket.conn.remoteAddress);

        try {
            // create scoket events for each motor in the array above.
            for(let i = 0; i < motor.length; i++)
                socket.on(motor[i].event, async (data) => {
                    // console.log(new Date(), socket.id, motor[i].event, data);
                    if (data === 'cw') await motor[i].motor.step(1);
                    if (data === 'ccw') await motor[i].motor.step(-1);
                });
        } catch(e) {
            console.error(e);
        }

        socket.on('disconnect', () => {
            // if the connected room is closing, forget the connection
            if(socket.id === idConnected) idConnected = "";
            console.log(new Date(), socket.id, 'attempted to close connection at', socket.conn.remoteAddress);
        });
    });

    app.use('/', express.static(__dirname));

    server.listen(8080, () => {
        console.log('Listening now');
    });
});