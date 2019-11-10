import * as contentController from '../controller-socket/contentController';


const socketevents = (socket) =>{
    socket.on('event1', (data) => {
        console.log('data:', data);
        const {msg} = data;
        contentController.function1(socket, {msg});
    });
}

export default socketevents;