const express = require('express');
const PORT = 3020

const app = express();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`it's working in port ${PORT} `);
});

app.get("/Hello-world" , (req, res) => {
    res.send("Hello World");
});
