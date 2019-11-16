
import app from './app';
import socketEvents from './socketEvents';
export const http = require('http').Server(app);
export const io = require('socket.io')(http);

try {
    io.on('connection', function (socket) {
        console.log('[User Connected]', socket.id);

        socketEvents(socket);

        socket.on('disconnect', async function () {
            console.log('[A user disconnected][backend]');
        });
        return socket;
    });
} catch (err) {
    console.log('[ERROR]: SOCKET error.');
}
