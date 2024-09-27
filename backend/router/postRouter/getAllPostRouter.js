const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');
const userModel = require('../../model/userModel');

router.get('/' , isAuthenticate , async (req,res) => {
    try{
    // console.log('h');
    let posts = await Post.find().sort({createdAt : -1})
    .populate('author', 'userName profilePicture');
    const authorId=  req.id;
    const user =await userModel.findById(authorId);
    // const userInterest = user.interests;
    
    // const suggestedPost = posts.filter((post) => {
    //     // console.log(post.author.interests);
    //     return post.author.interests 
    //     && post.author.interests.some((interest) => userInterest.includes(interest));
    // });
    // console.log('p');
    
    // posts = suggestedPost;
    
    
    // console.log("suggestted" , suggestedPost[0].author.interests);
    // console.log("suggestted" , suggestedPost.length);
    // suggestedPost.forEach((post) => {
    //     console.log(post.author.userName);        
    // })
    
    
    // console.log('h');
    
    return res.status(200).render('homePage' ,{posts , user});
    } catch(err){
        res.send(err.message);
    }
})

router.get('/:domain' , isAuthenticate ,async (req,res) => {
    try{
        const userInterest = req.params.domain;
        // console.log(userInterest);
        let posts = await Post.find().sort({createdAt : -1})
        .populate('author', 'userName profilePicture interests');
    
        const suggestedPost = posts.filter((post) => {  
            return post.author.interests 
            && post.author.interests
            .map(interest => interest.trim().replace(" " , '').toLowerCase())
            .includes(userInterest)
        });

        posts = suggestedPost;
        // console.log(suggestedPost[0].author);

        const authorId=  req.id;
        const user =await userModel.findById(authorId);

        return res.status(200).render('homePage' ,{posts , user});
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;
