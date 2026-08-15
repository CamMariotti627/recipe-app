const pool = require('./db');
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
//JS route handler = now async waits on database query
app.get("/api/v1/recipes", async (req, res) => {
    try {
        //SQL -selects every column/row from recipes table
        const result = await pool.query('SELECT * FROM recipes');
        //JS - sends rows back to JSON
        res.json(result.rows);
    } catch (err) {
    //JS-if query fails for any reason, doesn't crash server
    // sends back err response
    console.error(err);
    res.status(500).json( { error: 'Something went wrong fetching your recipes.'});
    }
})
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});