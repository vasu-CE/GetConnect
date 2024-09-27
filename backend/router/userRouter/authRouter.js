const express = require("express");
const User = require('../../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const isAuthenticate = require("../../middleware/isAuthenticate");
const userModel = require("../../model/userModel");
const Post = require('../../model/PostModel')
const router = express.Router();
const upload = require('../../middleware/multer');
// const dataUriToBuffer = require('data-uri-to-buffer');

const jwtSecret = "sdfgfdge";

router.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            req.session.message = 'User already exists';
            // return res.status(400).send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let newUser = new User({
            userName,
            email,
            password: hash,
        });

        user = await newUser.save();
        // console.log(newUser);
        
        const token = jwt.sign({userId : newUser._id}, jwtSecret, { expiresIn: '1h' });
        res.cookie("token", token);
        // res.send(newUser);
        res.redirect('/post/allpost');
        // res.render("profile" , {user});
    } catch (err) {
        console.error('Error in signup:', err);
        req.session.message = 'Error in signup';
        // res.render('profile');
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("You need to sign up first!!!");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign({ userId : user._id }, jwtSecret, { expiresIn: '1h' });
        res.cookie("token", token);
        // console.log(user);
        res.redirect('/post/allpost');

        
        // const posts = await Post.find().sort({createdAt:-1})
        //     .populate({
        //         path : 'author',
        //         select : 'userName profilePicture'
        //     });

        // return res.status(200).render('profile' ,{posts , user});

        // res.render("profile" , {user , posts});
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).send("Error in login");
    }
});

router.post('/connection/:id' , isAuthenticate , async(req,res) => {
    try{
        const myid = req.id;
        const another = req.params.id;
        
        if(myid == another){
            res.send("You can't follow you ")
        }

        const user = await userModel.findById(myid);
        const target = await userModel.findById(another);
        
        if(!user || !target){
            res.send("User not found");
        }
        console.log(another);
        
        const isConnection = user.connection.includes(another);
        if(isConnection){
            
            await Promise.all([
                userModel.updateOne({_id:myid} , {$pull : {connection:another}}),
                userModel.updateOne({_id : another} , {$pull : {connection : myid}})
            ])
        }else{
            await Promise.all([
                userModel.updateOne({_id : myid} , {$push :{connection : another}}),
                userModel.updateOne({_id : another} , {$push : {connection : myid}})
            ])
        }

        res.redirect('/post/allpost');
    }catch(err){
        res.send(err.message);
    }
})

router.post("/logout", async (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.send("Logged out successfully");
});

router.post('/register', isAuthenticate,upload.fields([
    {name : 'profilePic'},
    {name : 'resume'}
]) ,async (req,res) => {
    try{
        const authorId = req.id;
        const user =await userModel.findById(authorId);
        // console.log(req.body);
        const {userName ,bio, experience ,interest , gender , description} = req.body;
        const { profilePic, resume } = req.files;
        if(userName){
            // console.log(userName);
            // console.log(user.userName);
            user.userName = userName;
        }
        if(bio) user.bio = bio;
        if(experience) user.experience = experience;
        if (interest) {
            await userModel.findOneAndUpdate(
                { _id: authorId },
                { $addToSet: { interests: interest } }, 
                { new: true, useFindAndModify: false }
            );
        }
        // console.log(gender);
        user.gender = gender;
        if (profilePic && profilePic.length > 0) {
            user.profilePicture.data = profilePic[0].buffer;
        }
        if(resume && resume.length>0){
            user.resume.data = resume[0].buffer;
        }
        
        await user.save();
        // console.log("hyyy");
        res.redirect(`/view/${authorId}/profile`);
    } catch(err){
        res.send(err.message);
    }
})

module.exports = router;
