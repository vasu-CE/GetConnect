const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();
const Post = require('../../model/PostModel');
const redisClient = require('../../services/redis.service');

router.get('/' , isAuthenticate , async (req,res) => {

    try{
        // console.log('Fetching posts from MongoDB');
        let posts = await Post.find().sort({ createdAt: -1 })
            .populate('author', 'userName profilePicture')
            .populate({
                path: 'comments.user',
                select: 'userName profilePicture'
            });

    
    return res.status(200).json({
        success : true,
        posts
    })
    } catch(err){
        // res.send(err.message);
        return res.status(404).json({
            message : err.message,
            success : false
        })
    }
})

router.post('/interests' , isAuthenticate ,async (req,res) => {
    try{
        const userInterest = req.body.userInterest;
        // console.log(userInterest);
        // console.log("hyy");
        if (userInterest.length === 0) {
            let posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'userName profilePicture interests');
            return res.status(200).json({
              success: true,
              posts,
            });
          }
        let posts = await Post.find().sort({createdAt : -1})
        .populate('author', 'userName profilePicture interests');
    
        const suggestedPost = posts.filter((post) => {
            return post.author.interests && post.author.interests.some((interest) => {
              return userInterest
                .map((interest) => interest.trim().replace(" ", '').toLowerCase())
                .includes(interest.trim().replace(" ", '').toLowerCase());
            });
        });

        posts = suggestedPost;

        return res.status(200).json({
            success : true,
            posts
        })
    }catch(err){
        res.send(err.message);
    }
})


module.exports = router;
