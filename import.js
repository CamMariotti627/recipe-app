const pool = require('./db');

async function fetchrecipes() {
//total number of recipes to pull and batch size
const totalRecipesWanted = 300;
const batchSize = 100;

//outer loop: runs per *batch* & auto increases offset 
for (let offset = 0; offset < totalRecipesWanted; offset += batchSize) {

    const url = `https://datasets-server.huggingface.co/rows?dataset=AkashPS11/recipes_data_food.com&config=default&split=train&offset=${offset}&length=${batchSize}`;

    const response = await fetch(url);
    const data = await response.json();

    //outer loop directly references recipes instead of single row 
    for (const rowItem of data.rows) {
        const recipe = rowItem.row;

        // skips any recipes without names - can't be entered
        if (!recipe.Name) continue;

        const insertRecipeQuery = `
            INSERT INTO recipes (recipe_name, servings, total_calories, calories_per_serving)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (recipe_name) DO NOTHING
            RETURNING recipe_id
            `;
        const values = [
            recipe.Name,
            recipe.RecipeServings,
            recipe.Calories,
            recipe.RecipeServings ? recipe.Calories / recipe.RecipeServings : null
        ];

        const result = await pool.query(insertRecipeQuery, values);
        
        //if ON CONFLICT DO NOTHING skipped recipe result rows is empty
        if (result.rows.length === 0) {
            console.log('Skipped duplicate:', recipe.Name);
            continue;
        }

        const newRecipeId = result.rows[0].recipe_id;



        console.log('Inserted Recipe:', recipe.Name, '-ID:', newRecipeId);

        // ingredients loop - once per recipe
        const ingredientsArray = parseRVector(recipe.RecipeIngredientParts);
        for (const ingredientName of ingredientsArray) {
            const insertIngredientQuery = `
            INSERT INTO ingredients (recipe_id, ingredient_name)
            VALUES ($1, $2)
            `;
            await pool.query(insertIngredientQuery, [newRecipeId, ingredientName]);
        }
        // steps loop: runs once per recipe
        const instructionsArray = parseRVector(recipe.RecipeInstructions);
        for (let i = 0; i < instructionsArray.length; i++) {
            const stepNumber = i + 1;
            const instructionText = instructionsArray[i];

            const insertStepQuery = `
                INSERT INTO steps (recipe_id, step_number, instruction)
                VALUES ($1, $2, $3)
            `;
            await pool.query(insertStepQuery, [newRecipeId, stepNumber, instructionText]);
           }
        }
    }

    console.log('Import complete.');
}

fetchrecipes();


// parces vectors from R - regex
function parseRVector(str) {
    if (!str) return[];
        //removes c() at start and end. 
    const inner = str.replace(/^c\(/, '').replace(/\)$/, '');
        //split on commas that are being quoted strings, then clean up quotes
    const matches = inner.match(/"([^"]*)"/g);
    if (!matches) return [];
    return matches.map(s => s.replace(/^"|"$/g, ''));
}

//NOTES:
// async - lets us use await to pause execution until network req finishes (finishing data takes time, so we wait for it rather than move on before it arrives)

//fetch(url) - node's built in way to make an HTTP req (same concept as browser fetching a webpage - but from code)

//offset=0&length=5 - only taking 5 rows to establish early sets of data before upscale





//personal reminder regular abbreviations:
/*
str-string
arr-array
obj-object
fn-function
idx-index
*/



