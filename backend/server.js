const express = require('express');
const { app , server} = require('./socket/socket');

var createError = require('http-errors');
// var app = express();


const path = require('path');
const cookieParser = require('cookie-parser');
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

const session = require('express-session')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'/public')));
app.set("view engine" , 'ejs');
app.set('views',path.join(__dirname,"/views"))

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

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

app.get("/",(req,res)=>{
    res.render('login');
})

server.listen(3000 , () => {
    console.log("http://localhost:3000/");
})