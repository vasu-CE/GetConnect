const express = require('express');
const { app , server} = require('./socket/socket');
const cors =  require('cors');
// var app = express();
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')

dotenv.config({});

// CORS middleware
app.use(cors({
    origin: process.env.URL,
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'qwerhjj',
    resave: false,
    saveUninitialized: true
}));
// const userModel = require('./model/userModel');
const authRouter = require('./router/userRouter/authRouter');
const profileRouter = require('./router/userRouter/controlle');
const renderRouter = require('./router/userRouter/rendering');
const profile2Router = require('./router/userRouter/profile2Router');
const likeAndDislike = require('./router/postRouter/likeAndDislike');
const deletePost = require('./router/postRouter/deletePostRouter');

const addPost = require('./router/postRouter/addPostRouter');
const getAllPost = require('./router/postRouter/getAllPostRouter');
const myPost = require('./router/postRouter/getMyPostRouter');

const message = require('./router/userRouter/message');
const search = require('./router/userRouter/search');
const quiz = require('./router/userRouter/quiz');

const projectRoutes = require('./router/projectRouter/project.routes')
const aiRoutes = require('./router/projectRouter/ai.routes')


app.use('/user',authRouter);
app.use('/profile' , profileRouter);
app.use('/view' , profile2Router);
app.use('/render' , renderRouter);
app.use('/post/addPost' , addPost);
app.use('/post/allpost' , getAllPost);
app.use('/userpost/all' , myPost);
app.use('/post' , likeAndDislike)
app.use('/post' , deletePost)
app.use('/messages' , message);
app.use('/search' , search);
app.use('/quiz',quiz);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath, {
    setHeaders: function (res, path) {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }
}));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port , () => {
    console.log(`http://localhost:${port}`);
})