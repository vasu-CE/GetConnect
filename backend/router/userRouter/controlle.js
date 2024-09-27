const express = require("express");
const router = express.Router();
const User = require('../../model/userModel');
const isAuthenticate = require('../../middleware/isAuthenticate')
const upload = require('../../middleware/multer');
const Post = require('../../model/PostModel');
const userModel = require("../../model/userModel");

router.post('/edit', isAuthenticate ,upload.fields([
    {name : 'profilePic'},
    {name : 'resume'}
]) , async (req,res) => {
    // console.log("H");
    // console.log(req.id);
    
    const authorId = req.id;
    const {userName,gender,bio,interests,deleteInterest} = req.body;  
    const { profilePic, resume } = req.files;
    // console.log(authorId);
    
    try{
        let user =await User.findById(authorId);
        if(!user){
            return res.status(401).json({
                message : 'user not found'
            })
        }

        if(userName) user.userName = userName;
        if(bio) user.bio = bio;

        if (profilePic && profilePic.length > 0) {
            user.profilePicture.data = profilePic[0].buffer;
        }

        // const interest = req.body.interest;
        if (interests) {
            await userModel.findOneAndUpdate(
                { _id: authorId },
                { $addToSet: { interests: interests } }, 
                { new: true, useFindAndModify: false }
            );
        }

        if(deleteInterest){
            user.interests.pull(deleteInterest);
        }

        if(resume && resume.length > 0){
            user.resume.data = resume[0].buffer;
        }
        if (gender) user.gender = gender;

        await user.save();
        console.log("Success");
        // return res.status(200).render('profile' , {user});
        res.redirect(`/view/${authorId}/profile`);
    }catch (err) {
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: err.message,
        });
    }
})

module.exports = router;