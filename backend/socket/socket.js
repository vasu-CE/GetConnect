// const { Server } = require('socket.io');
// const express = require('express');
// const http = require('http');
// const app = express();

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ['GET', 'POST']
//     }
// });

// const userSocketMap = {};

// // Helper function to get receiver socket IDs
// const getReciverSocketId = (receiverId) => userSocketMap[receiverId];

// io.on('connection', (socket) => {
//     const userId = socket.handshake.query.userId;

//     // Reject connection if userId is missing
//     if (!userId) {
//         console.error('Connection rejected: Missing userId in handshake query.');
//         socket.disconnect(true); // Ensure the socket disconnects
//         return;
//     }

//     // Add socket to userSocketMap
//     if (!userSocketMap[userId]) {
//         userSocketMap[userId] = [];
//     }
//     userSocketMap[userId].push(socket.id);

//     // Emit updated online users
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));

//     // Handle user disconnection
//     socket.on('disconnect', () => {
//         userSocketMap[userId] = userSocketMap[userId].filter((id) => id !== socket.id);
//         if (userSocketMap[userId].length === 0) {
//             delete userSocketMap[userId];
//         }
//         io.emit('getOnlineUsers', Object.keys(userSocketMap));
//     });

//     // Handle 'typing' event
//     socket.on('typing', (receiverId) => {
//         if (userSocketMap[receiverId] && userSocketMap[receiverId].length > 0) {
//             userSocketMap[receiverId].forEach((id) => {
//                 io.to(id).emit('userTyping', userId);
//             });
//         }
//     });
// });

// module.exports = { app, server, io, getReciverSocketId };

const http = require('http');
const {Server} = require('socket.io');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const projectModel = require('../model/projectModel');
const {generateResult} = require('../services/ai.service');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : '*'
    }
});

io.use(async (socket , next) => {
    try{
        const projectId = socket.handshake.query.projectId;
        
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error('Invalid projectId'));
        }
        socket.project = await projectModel.findById(projectId);

        next();
    }catch(err){
        next(err);
    }
})
io.on('connection',socket => {
    console.log("A user connected");
    socket.roomId = socket.project._id.toString();

    socket.join(socket.roomId);

    socket.on('project-message' ,async (data) => {
        
        const message = data.message;
        const aiIsPresent = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message',data)
        // io.to(socket.roomId).emit('project-message',data) //message give only other not send to me also
        
        if(aiIsPresent) {
            
            const prompt = message.replace('@ai' , '');
            // console.log(prompt);
            const result = await generateResult(prompt);
            io.to(socket.roomId).emit('project-message' , {
                message : result,
                sender : {
                    _id : 'ai',
                    userName : 'AI'
                }
            })
            return 

        }
    })

    socket.on('disconnect' , () => {
        console.log('disconnect');
        socket.leave(socket.roomId);
    });
});

module.exports = { app, server, io };