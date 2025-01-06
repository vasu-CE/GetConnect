import { io } from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    if (!socketInstance) {
        socketInstance = io('http://localhost:3000' ,{
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