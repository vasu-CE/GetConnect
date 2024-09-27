const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    caption : {
        type : String,
        default : ""
    },
    image : {
        filename: String,
        data: Buffer,
        contentType: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

module.exports = mongoose.model("Post" , postSchema);