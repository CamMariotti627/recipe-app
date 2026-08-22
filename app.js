const pool = require('./db');
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
//GET endpoint 1 search by recipe name:
//JS route handler = now async waits on database query

app.get("/api/v1/recipes", async (req, res) => {
    try {
        //pulls ?name - something from URL if provided
        const { name } = req.query;

        let queryText = 'SELECT * FROM recipes';
        let values = [];
        // SQL adds WHERE clause only a name filter is provided
        if (name) {
            queryText += ' WHERE recipe_name ILIKE $1';
            values.push(`%${name}%`);
        }

        const result = await pool.query(queryText, values);
        res.json(result.rows);

    } catch (err) {
    //JS-if query fails for any reason, doesn't crash server
    // sends back err response
    console.error(err);
    res.status(500).json( { error: 'Something went wrong while fetching your recipes. Please try again later.' });
    }
})

//GET endpoint 2: search by ingredient

app.get("/api/v1/recipes/search-by-ingredient", async (req, res) => {
    try {
        const { ingredient } = req.query;

        if (!ingredient) {
            return res.status(400).json({ error: 'Please provide at least one ingredient'})
        }

        const ingredientList = ingredient.split(',').map(i => `%${i.trim()}%`);

        const queryText = `
        SELECT recipes.*
        FROM recipes
        JOIN ingredients ON recipes.recipe_id = ingredients.recipe_id
        WHERE ingredients.ingredient_name ILIKE ANY ($1)
        GROUP BY recipes.recipe_id
        HAVING COUNT(DISTINCT ingredients.ingredient_name) >= $2
        `;

        const result = await pool.query(queryText, [ingredientList, ingredientList.length]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong searching by ingredient.' });
    }
});

//GET endpoint - exclude recipes containing specific ingredients (like allergies)

app.get("/api/v1/recipes/exclude-ingredient", async (req, res) => {
    try {
        const { exclude } = req.query;

        if (!exclude) {
            return res.status(400).json({ error: 'Please provide at least one ingredient to exclude.' });
        }

        const excludeList = exclude.split(',').map(i => `%${i.trim()}%`);

        const queryText = `
        SELECT * FROM recipes
        WHERE recipe_id NOT IN (
            SELECT DISTINCT recipe_id FROM ingredients
            WHERE ingredient_name ILIKE ANY ($1)
        )   
        `;

        const result = await pool.query(queryText, [excludeList]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong excluding ingredients.' });
    }
    
});

//POST route, lets add recipe

app.post("/api/v1/recipes", async (req, res) => {
    try {
        const { recipe_name, servings, total_calories, calories_per_serving, pairs_with, suggested_sides } = req.body;

        const insertQuery = `
        INSERT INTO recipes (recipe_name, servings, total_calories, calories_per_serving, pairs_with, suggested_sides)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;

        const values = [recipe_name, servings, total_calories, calories_per_serving, pairs_with, suggested_sides];

        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while adding your recipe.' });
    }
});

// PUT endpoint: updates existing recipe by ID
app.put("/api/v1/recipes/:id", async (req, res) => {
    try {
        // ID comes from URL 
        const { id } = req.params;

        const { recipe_name, servings, total_calories, calories_per_serving, pairs_with, suggested_sides } = req.body;

        const updateQuery = `
        UPDATE recipes
        SET recipe_name = $1, servings = $2, total_calories = $3, calories_per_serving = $4, pairs_with = $5, suggested_sides = $6
        WHERE recipe_id = $7
        RETURNING *
        `;

    const values = [recipe_name, servings, total_calories, calories_per_serving, pairs_with, suggested_sides, id];

    const result = await pool.query(updateQuery, values);

    // if no rows came back, ID didn't exist
         if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong updating your recipe.'});
    }
});


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});