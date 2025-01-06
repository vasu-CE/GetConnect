const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    participants:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }],
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", messageSchema);
