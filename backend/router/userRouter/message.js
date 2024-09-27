const express = require('express');
const router = express.Router();
const Message = require('../../model/messageModel');

router.get('/', async (req, res) => {
    // console.log('hyy');
    const { fromUserId, toUserId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        .populate('fromUserId', 'userName profilePicture') // Populate sender's details
        .populate('toUserId', 'userName profilePicture')   // Populate recipient's details
        .sort({ timestamp: 1 });

        const processedMessages = messages.map(msg => ({
            ...msg._doc,
            fromUserId:{
                userName : msg.fromUserId.userName,
                profilePicture : msg.fromUserId.profilePicture?.data ?{
                    contentType: msg.fromUserId.profilePicture.contentType,
                    data: msg.fromUserId.profilePicture.data.toString('base64')
                } : null
            },
            toUserId : {
                userName : msg.toUserId.userName,
                profilePicture : msg.toUserId.profilePicture?.data ? {
                    contentType : msg.toUserId.profilePicture.contentType,
                    data : msg.toUserId.profilePicture.data.toString('base64')
                } :null
            }
        }));

        res.json(processedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
