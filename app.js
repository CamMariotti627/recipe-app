const express = require("express");
const app = express();
const port = 4000;
app.get("/recipes", (req,res) => {
    res.send("Here are some recipes!");
});
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});