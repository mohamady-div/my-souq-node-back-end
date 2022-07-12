const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');

const PORT = 3020

const app = express();

app.use(authRouter);

mongoose.connect('').then(() => {
    console.log('Conneced :)');
}).catch((e) => { console.log(e); });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`it's working in port ${PORT} `);
});