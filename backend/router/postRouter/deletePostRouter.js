const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');
const userModel = require('../../model/userModel');

router.get('/delete/:id' , isAuthenticate , async (req,res) => {
    try{
        const userId = req.id;
        const postId = req.params.id;
        
            
        const post =await Post.findById(postId);
        if(!post) return res.send("Post not found");
        console.log(userId);
        console.log(post.author);

        
        if(post.author.toString() != userId){
            return res.send("You can't delete this post");
        }

        await Post.findByIdAndDelete(postId);

        let user = await userModel.findById(userId);
        user.posts = user.posts.filter(id => id.toString() != postId);
        await user.save();

        res.redirect('/post/allpost');

    } catch(err){
        res.send(err.message);
    }
})

module.exports = router;
