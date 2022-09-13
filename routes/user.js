const express = require('express');
const userRouter = express.Router();
const auth = require('../components/my_auth');
const { Product } = require('../models/product');
const User = require('../models/user');

userRouter.post('/api/add-to-cart', auth, async (req, res) => {
    try {
        const {id , qty} = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
        if (user.cart.length == 0) {
            const cartSchema = {
                product ,
                qty: Number(qty)
            }
            user.cart.push(cartSchema);
        } else {
            let isFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(id)) {
                    user.cart[i].qty += Number(qty);
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                const cartSchema = {
                    product ,
                    qty: Number(qty)
                }
                user.cart.push(cartSchema);
            }
        }
        user = await user.save(); 
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.delete('/api/remove-to-cart/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        let user = await User.findById(req.user);
        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(id)) {
                if (user.cart[i].qty > 1) {
                    user.cart[i].qty -= 1;
                } else {
                    user.cart.splice(i, 1);
                }
                break;
            }
        }
        user = await user.save(); 
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = userRouter;