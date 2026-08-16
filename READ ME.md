# Recipe App API

## Description 
This API is an app designed to search for recipes by available ingredients.  As a foodie, I am always looking for a way to both find new ideas for recipes, and think of ideas based on what I have available without needing to buy more groceries which this API will assist with and solve. 

## Tech Stack
-**Node.js** - JavaScript runtime
-**Express** - ('express') - web framework for buildling API
-**PostgreSQL** - relational database
-**pg** ('pg') - Node.js client for connection to PostgreSQL
-**dotenv** - ('dotenv') - loads environment variables from '.env'
-**nodemon** ('nodemon', dev dependency) - auto-restarts sever during development
-Deployed on **Render**

## API Endpoints

### GET /api/v1/recipes
Returns all recipes. Supports optional filtering:
- '?name=chicken' - filters by recipe name (partial match)

### POST /api/v1/recipes
Creates a new recipe. Body (JSON):
```json
{
    "recipe_name": "string",
    "servings": number, 
    "total_calories": number, 
    "calories_per_serving": number, 
    "pairs_with": "string",
    "suggested_sides": "string",
}
```
### PUT /api/v1/recipes/:id
Updates an existing recipe by ID.
//EXAMPLE: /api/vi/recipes/1  
```json
{
    "recipe_name": "string",
    "servings": number, 
    "total_calories": number, 
    "calories_per_serving": number, 
    "pairs_with": "string",
    "suggested_sides": "string",
}
```

## Data Source
Recipe data imported from [HuggingFace/https://datasets-server.huggingface.co/rows?dataset=AkashPS11/recipes_data_food.com&config=default&split=train&offset=${offset}&length=${batchSize}],

via 'import.js'


## Author
Cam Mariotti
