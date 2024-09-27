const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');
const userModel = require('../../model/userModel');

router.post('/' , isAuthenticate , upload.single('image') , async (req,res) => {
    try{
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) return res.send('image is  requierd');

        const newPost =new Post({
            caption,
            image : {
                filename : image.originalname,
                data : image.buffer,
                contentType : image.mimetype
            },
            author : authorId
        })

        await newPost.save();

        const user = await userModel.findById(authorId);
        user.posts.push(newPost._id);
        await user.save();
        // res.render('profile' , {user});
        res.redirect('/post/allpost');
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;