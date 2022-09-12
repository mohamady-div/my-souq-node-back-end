const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

const DBC = "mongodb+srv://mon_sa:7nz883lmVyRcG6Al@cluster0.qnkeb.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3020;

const app = express();

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose.connect(DBC).then(() => {
    console.log('Conneced :)');
}).catch((e) => { console.log(e); });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`it's working in port ${PORT} `);
});