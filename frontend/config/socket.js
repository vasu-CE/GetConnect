import { io } from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    if (!socketInstance) {
        socketInstance = io(`${import.meta.env.VITE_URL}` ,{
            query : {
                projectId
            }
        });
    }
    return socketInstance;
};

const receiveMessage = (eventName , cb) => {
    socketInstance.on(eventName , cb);
}

const sendMessage = (eventName , data) => {
    socketInstance.emit(eventName , data);
}

export { initializeSocket , receiveMessage , sendMessage };