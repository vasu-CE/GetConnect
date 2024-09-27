const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');

router.get('/:id/like' , isAuthenticate , async (req,res) => {
    try{
        const likekarnevala = req.id;
        const postId = req.params.id;

        const post =await Post.findById(postId);
        if(!post) return res.send("post not found");

        await post.updateOne({$addToSet : {likes : likekarnevala}});

        await post.save();
        // return res.status(200);
        res.redirect('/post/allpost');
        // res.status(200).json({ likeCount: post.likes.length });
    } catch(err){
        res.send(err.message);
    }
})

router.get('/:id/dislike' , isAuthenticate , async (req,res) => {
    try{
        const likekarnevala = req.id;
        const postId = req.params.id;

        await Post.findByIdAndUpdate(postId, { $pull: { likes: likekarnevala } });
        res.redirect('/post/allpost');
        // return res.status(200);
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;
