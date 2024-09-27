const {Server} = require('socket.io');
const express = require('express');
const http = require('http');
const User = require('../model/userModel');
const app = express();
const Message = require('../model/messageModel');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

const userSocketMap = {};

async function getUser(id) {
    if (!id) return "Unknown User";  // Guard clause for invalid id

    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error fetching user name:", error);
        return "Unknown User";  // Fallback for errors
    }
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    // console.log('User ID:', userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
        // console.log(`User connected: ${userId} from ${socket.id}`);
        io.emit('isOnline', Object.keys(userSocketMap)); // Emit online users
    } else {
        console.log('User ID is missing in the query.');
    }

    socket.on('message',async (data) => {
        const { toUserId, message } = data;
        const recipientSocketId = userSocketMap[toUserId];
        const user = await getUser(socket.handshake.query.userId);
        const name = user ? user.userName : "Unknown User";
        const userProfilePicture = user ?{
            data :  user.profilePicture.data.toString('base64'),
            contentType : user.profilePicture.contentType || 'image/png'
        } : null;
        // console.log(name);
    
        if (recipientSocketId) {
            await Message.create({
                fromUserId : socket.handshake.query.userId,
                toUserId,
                message
            });
            // Send the message to the recipient
            // console.log(socket.handshake.query.userId);
            io.to(recipientSocketId).emit('message', { fromUserId: socket.handshake.query.userId,name,message,userProfilePicture});
        }
    
        // Send the message to the sender as well
        socket.emit('message', { fromUserId: socket.handshake.query.userId,name, message,userProfilePicture });
    });

    
    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            // console.log(`User disconnected: ${userId} from ${socket.id}`);
            io.emit('isOnline', Object.keys(userSocketMap)); // Emit updated online users
        } else {
            console.log('User ID was missing during disconnect.');
        }
    });
});

module.exports = {app , server, io};