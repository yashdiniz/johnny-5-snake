/**
 * This is the server side code!!
 * Do not assume this is client side!
 */

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
    console.log(new Date(), 'Board ready');
    const motor = [  
        { motor: new Motor(7, 6), event: 'motorA:step' }, 
        { motor: new Motor(5, 4), event: 'motorB:step' },
        { motor: new Motor(3, 2), event: 'motorC:step' } ];
    let idConnected = ""; // holds the ID of the active room...

    io.on('connection', async socket => {
        if (!idConnected) idConnected = socket.id;  // if first connection, save the room ID
        else socket.disconnect();   // disconnect every subsequent request which does not match
        console.log(new Date(), socket.id, 'connected:', socket.connected, 'at', socket.conn.remoteAddress);

        try {
            // create socket events for each motor in the array above.
            for(let m of motor)
                socket.on(m.event, async (data) => {
                    if (data === 'cw') await m.motor.step(1);
                    if (data === 'ccw') await m.motor.step(-1);
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

    app.get('/rtt/:time', (req, res) => {
        res.send(req.params.time);   // used to obtain round trip time at client to prevent congestion of commands...
    });

    server.listen(8080, () => {
        console.log(new Date(), 'Now listening for commands');
    });
});