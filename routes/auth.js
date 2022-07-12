const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) =>  {
 try {
    const {name , email, password} = req.body;
    
     const exisitingUser = await User.findOne({ email });
     if (exisitingUser) {
        return res.status(400).json({msg: "Email is already there, "});
     }

     const hPassword = await bcrypt.hash(password, 8);

     let user = new User({email, password: hPassword, name}); 

     user = await user.save();
     res.json(user);
 } catch (e) {
    res.status(500).json({error: e.message});
 }
});

module.exports = authRouter;