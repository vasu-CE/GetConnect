const express  = require('express');
const router = express.Router();
const User = require('../../model/userModel');
const isAuthenticate = require('../../middleware/isAuthenticate');
router.get('/edit',isAuthenticate ,async (req,res) => {
    const authorId = req.id;
    const user = await User.findById(authorId);
    res.render('profileEdit' , {user});
})

router.get('/profile' , (req,res) => {
    res.render('register');
})

router.get('/resume/:id' ,async (req,res) => {
    try{
        const authorId = req.params.id;
        const user =await User.findById(authorId);
        
        const base = user.resume.data;
        const resumeBuffer = Buffer.from(base, 'base64');

        if (!Buffer.isBuffer(resumeBuffer)) {
            return res.status(400).send('Invalid resume data');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
        res.send(resumeBuffer);
    }catch(err){
        console.log(err.message);
    }
})
// router.get('/resume/:userId',async (req, res) => {
//     const userId = req.params.userId;
//     const user = await User.findById(userId);
  
//     if (!user || !user.resume) {
//       return res.status(404).send('Resume not found');
//     }
//     res.send(user.resume);
// });
router.get('/resume1/:id' , (req,res) => {
    const authorId = req.params.id;
    // const author = User.findById(authorId);
    res.render('resume' , {authorId});
})

router.get('/chat/:id' ,isAuthenticate ,async (req,res) => {
    const userId = req.params.id;

    const authorId = req.id;
    // const author = User.findById(authorId);

    const user = await User.findById(userId);
    const users = await User.find();
    res.render('chat' , {user , users , authorId});
})
module.exports = router;