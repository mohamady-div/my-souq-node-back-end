const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req, res, next) => {
   
    try {
        const token = req.header('my-souq-auth-token');
        if (!token) {
            return res.status(401).json({msg: "Not atuthrized user"});
        }

        const verified = jwt.verify(token, "passwordKey");
        if (!verified) {
            return res.status(401).json({msg: "Token is not working, not allawed"});
        }
        const user = await User.findById(verified.id);
        if (user.type  == 'user' || user.type == 'seller') {
            return res.status(401).json({msg: 'this user is not admin '});
        }
        req.user = verified.id; 
        req.token = token;
        next();
    } catch (e) {
      res.status(500).json({error: e.message});
   }
}

module.exports =  admin;