const express  = require('express');
const router = express.Router();
const User = require('../../model/userModel');
const isAuthenticate = require('../../middleware/isAuthenticate');

const availableTechInterests = [
    'Web Development', 'JavaScript', 'Python', 'Java', 'Node.js', 'Express.js', 'React.js', 'Vue.js', 'CSS', 'HTML', 'SQL', 'MongoDB', 'Firebase', 'GraphQL', 
    'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Deep Learning', 'Blockchain', 'Cybersecurity', 'Game Development', 'Mobile App Development', 
    'Android Development', 'iOS Development', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Cloud Computing', 'AWS', 'Azure', 
    'Google Cloud', 'Linux', 'DevOps', 'Software Testing', 'Agile', 'Scrum', 'Project Management', 'UI/UX Design', 'Software Architecture', 'DevSecOps', 
    'Database Management', 'Big Data', 'Data Analytics', 'Business Intelligence', 'Serverless Computing', 'Virtualization', 'IoT (Internet of Things)', 
    'Embedded Systems', 'Networking', 'Database Administration', 'Continuous Integration', 'Continuous Deployment', 'Tech Startups', 'E-commerce', 'SEO for Developers', 
    'Automated Testing', 'Cloud Security', 'Containerization', 'Microservices', 'API Development', 'Serverless Architecture', 'JavaScript Frameworks', 
    'Agile Development', 'Software Development', 'Ruby on Rails', 'React Native', 'Flutter', 'Testing Frameworks', 'GraphQL API', 'API Testing', 'Tech Innovations', 
    'Virtual Reality', 'Augmented Reality', '5G Technology', 'Quantum Computing', 'Robotic Process Automation (RPA)', 'Wearable Tech', 'Edge Computing', 'Tech for Good'
];
  
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
        
        const resumeImg = user.resume;
        // console.log(resumeImg);

        return res.status(200).json({
            success : true,
            resumeImg
        })
    }catch(err){
        return res.status(401).json({
            success : false
        })
    }
})

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
    // console.log('hyy');
    const userId = req.params.id;

    const authorId = req.id;
    // const author = User.findById(authorId);

    const user = await User.findById(userId);
    const users = await User.find();
    res.send({user , users , authorId});
})

router.get('/interests',isAuthenticate,async (req,res) => {
    // res.json(availableTechInterests);
    const userId = req.id;
    const user = await User.findById(userId);

    const oldInterest = availableTechInterests.filter((interest) => interest==user.interests);
    const newInterest = availableTechInterests.filter((interest) => interest!=user.interests);

    res.send({oldInterest , newInterest});

})
module.exports = router;