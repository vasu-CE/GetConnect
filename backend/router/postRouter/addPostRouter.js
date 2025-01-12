const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');
const redisClient = require('../../services/redis.service');

router.post('/' , isAuthenticate , upload.single('image') , async (req,res) => {
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        // if(!image) return res.send('image is  requierd');
        const imageBuffer = image.buffer;
        const imageBase64 = imageBuffer.toString('base64');
        const imageURI = `data:image/jpeg;base64,${imageBase64}`;

        const newPost =new Post({
            caption,
            image : imageURI,
            author : authorId
        })

        await newPost.save();
        const populatedPost = await Post.findById(newPost._id)
        .populate({
            path: 'author',
            select: '_id userName profilePicture'
        });
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate('author', 'userName profilePicture');
        await redisClient.set('posts', JSON.stringify(posts), 'EX', 300);

        return res.status(200).json({
            message : "Post Successfully",
            success : true,
            post : populatedPost
        });

    }catch(err){
        return res.status(404).json({
            message : err.message,
            success : false
        });
    }
})

module.exports = router;