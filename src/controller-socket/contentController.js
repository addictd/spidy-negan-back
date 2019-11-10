export const function1 = (socket, data) => {
    
    socket.emit('responseEvent', {
        msg : "Successful",
        data
    });

    setTimeout(() => {
        socket.emit('responseEvent', {
            msg : "Successful",
            data
        });
    },4000);

}