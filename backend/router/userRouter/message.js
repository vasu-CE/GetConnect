const express = require('express');
const router = express.Router();
const isAuthenticate = require('../../middleware/isAuthenticate');
const conversationModel = require('../../model/conversationModel');
const messageModel = require('../../model/messageModel');
const { getReciverSocketId } = require('../../socket/socket');


router.post('/send/:id' ,isAuthenticate , async (req,res) => {
    try{
        const senderId = req.id;
        const recieverId = req.params.id;
        const {textMessage : message} = req.body;

        let conversation = await conversationModel.findOne({
            participants : {$all : [senderId , recieverId]}
        })
            
        if(!conversation){
            conversation = await conversationModel.create({
                participants : [senderId , recieverId],
                messages : []
            })
        }

        const newMessage = await messageModel.create({
            senderId,
            recieverId,
            message,
            conversationId: conversation._id
        });

        if(newMessage){
            conversation.messages = conversation.messages || []; 
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // const recieverSocketId = getReciverSocketId(recieverId);
        // if(recieverSocketId){
        //     io.to(recieverSocketId).emit('newMessage' , newMessage);
        // }
        // console.log("hyewert");
        
        return res.status(201).json({
            success : true,
            newMessage
        })
    }catch(err){
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending the message.'
        });
    }
})

router.get('/all/:id' ,isAuthenticate , async (req,res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        // console.log(senderId)
        // console.log(receiverId)
        if (!senderId || !receiverId) {
            return res.status(400).json({ 
                success: false, 
                message: senderId ? 'Receiver ID is required' : 'Sender ID is required' 
            });
        }

        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        // console.log(conversation);
        if (!conversation) {
            // return res.status(404).json({ success: false, message: 'Conversation not found' });
            return res.json({success : false})
        }
        const messages = await messageModel.find({ conversationId: conversation._id })
                                      .sort({ timestamp: 1 });
        res.json({ success: true ,messages });
    } catch (err) {
        console.error(err);
            res.status(500).json({ success: false, message: err.message });
    }
})

module.exports = router;
