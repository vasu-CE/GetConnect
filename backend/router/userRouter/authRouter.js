const express = require("express");
const isAuthenticate = require("../../middleware/isAuthenticate");
const userModel = require("../../model/userModel");
const router = express.Router();
const upload = require('../../middleware/multer');
const auth = require('../../controller/auth.controller');
// const dataUriToBuffer = require('data-uri-to-buffer');

const redisClient = require('../../services/redis.service');
const { sendOTP } = require("../../controller/auth.controller");


// router.post("/signup", async (req, res) => {
//     const { userName, email, password } = req.body;
    
//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             // req.session.message = 'User already exists';
//             return res.status(400).json({
//                 message : "User already exists",
//                 success : false
//             })
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         let newUser = new User({
//             userName,
//             email,
//             password: hash,
//         });

//         user = await newUser.save();
//         // console.log(newUser);
        
//         const token = jwt.sign({userId : newUser._id}, jwtSecret);
//         res.cookie("token", token);
//         // res.send(newUser);
//         // res.redirect('/post/allpost');
//         return res.status(200).json({
//             message : "Login successful",
//             success : true,
//             user
//         })
//         // res.render("profile" , {user});
//     } catch (err) {
//         // console.error('Error in signup:', err);
//         return res.status(404).json({
//             message : 'server error',
//             success : false
//         })
//         // res.render('profile');
//     }
// });

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 message: "You need to sign up first!",
//                 success : false
//              });
//         }

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({
//                 message: "Invalid credentials",
//                 success : false
//             });
//         }

//         const token = jwt.sign({ userId : user._id }, jwtSecret);
//         res.cookie("token", token, {
//             httpOnly: true,  // Prevent client-side access
//             secure: false,  // Set to `true` if deploying to HTTPS
//             sameSite: "lax", 
//             path: "/",
//         });
//         // console.log(user);
//         return res.status(200).json({
//             message: "Login successful",
//             success : true,
//             token,
//             user
//         });

//     } catch (err) {
//         console.error("Error in login:", err);
//         res.status(500).json({
//             message : "Error in login",
//             success : false
//         });
//     }
// });

router.route("/signup").post(auth.signup);
router.route('/sendotp').post(auth.sendOTP);
router.route('/login').post(auth.login);

router.get("/is-following/:id",isAuthenticate, async (req,res) => {
    try{    
        const myid = req.id;
        const another = req.params.id;

        const user = await userModel.findById(myid);
        const target = await userModel.findById(another);

        if(user.connection?.includes(another)){
            return res.status(200).json({
                isFollowing : true,
                success : true
            });
        }else{
            return res.status(200).json({
                isFollowing : false,
                success : false
            });
        }
        
    }catch(err){
        return res.status(500).json({
            message : "Error in isFollowing",
            success : false
        });
    }
})

router.post('/connection/:id', isAuthenticate, async (req, res) => {
    try {
        const myid = req.id;
        const another = req.params.id;
        // console.log(myid)
        if (myid === another) {
            return res.status(400).json({ success: false, message: "You can't follow yourself" });
        }

        const user = await userModel.findById(myid);
        const target = await userModel.findById(another);

        if (!user || !target) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isConnection = user.connection.includes(another);
        if (isConnection) {
            await Promise.all([
                userModel.updateOne({ _id: myid }, { $pull: { connection: another } }),
                userModel.updateOne({ _id: another }, { $pull: { connection: myid } })
            ]);
            return res.json({ success: true, message: "Unfollowed successfully", following: false });
        } else {
            await Promise.all([
                userModel.updateOne({ _id: myid }, { $push: { connection: another } }),
                userModel.updateOne({ _id: another }, { $push: { connection: myid } })
            ]);
            return res.json({ success: true, message: "Followed successfully", following: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
    console.log("hyh");
});


router.post("/logout", async (req, res) => {
    // console.log(req.cookies.token);
    const token = req.cookies.token;
    res.cookie("token" , "");

    res.status(200).json({
        message : "Logout successfully",
        success : true
    })
});

router.post('/register', isAuthenticate,upload.fields([
    {name : 'profilePic'},
    {name : 'resume'}
]) ,async (req,res) => {
    try{
        const authorId = req.id;
        const user = await userModel.findById(authorId);
        // console.log(req.body);
        const {userName ,bio, experience ,interest , gender} = req.body;
        const { profilePic, resume } = req.files;

        if(userName){
            user.userName = userName;
        };
        if(bio) user.bio = bio;
        if(experience) user.experience = experience;
        if (interest) {
            await userModel.findOneAndUpdate(
                { _id: authorId },
                { $addToSet: { interests: interest } }, 
                { new: true, useFindAndModify: false }
            );
        }

        if(gender){
            user.gender = gender;
        }
        if (profilePic && profilePic.length > 0) {
            const buffer = profilePic[0].buffer;
            const base64 = buffer.toString('base64');

            user.profilePicture = `data:image/jpeg;base64,${base64}`;
        }
        if(resume && resume.length>0){
            const buffer = resume[0].buffer;
            const base64 = buffer.toString('base64');
            user.resume = `data:application/pdf;base64,${base64}`;
        }
                
        await user.save();
        return res.status(200).json({
            message : "Profile created Successfully",
            success : true,
            user
        })
    } catch(err){
        return res.status(404).json({
            message : err.message,
            success : false
        });
    }
})

module.exports = router;
