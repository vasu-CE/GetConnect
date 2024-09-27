const mongoose = require('mongoose')

// Replace 'your_mongodb_uri_here' with your actual MongoDB URI
mongoose.connect('mongodb://localhost:27017/SGP')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


const userSchema = new mongoose.Schema({
    userName : {
        type:String,
        required : true
    },
    email : {
        type : String,
        required :true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    bio:{
        type:String,
        default:"Learner"
    },
    profilePicture: {
        filename: String,
        data: Buffer
    },
    experience : {
        type : String,
        default : ""
    },
    interests : {
        type : [String],
        enum : ['web development','java','node','express','css','exploring']
    },
    city : {
        type : String,
        enum : ['Anand','Surat','Jetpur']
    },
    gender : {
        type : String,
        enum : ['male' , 'female' , 'other']
    },
    description : {
        type : String,
        default : ""
    },
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }],
    connection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    resume : {
        filename: String,
        data: Buffer,
    }
    
},{timestamps : true});

module.exports = mongoose.model("User" , userSchema);