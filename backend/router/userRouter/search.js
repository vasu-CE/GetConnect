const express = require('express');
const User = require('../../model/userModel');
const router = express.Router()

router.get('/' , async (req,res) => {
    const user = await User.find();
    // console.log(user);
    res.json(user);
})

module.exports = router;