
import app from './app';
export const http = require('http').Server(app);
export const io = require('socket.io')(http);
import socketEvents from './socketEvents';

io.on('connection', function (socket) {
    console.log('[User Connected]');

    socketEvents(socket);
    
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    return socket;
});
