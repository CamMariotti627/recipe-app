# Recipe App API

## Description 
This API is an app designed to search for recipes by available ingredients.  As a foodie, I am always looking for a way to both find new ideas for recipes, and think of ideas based on what I have available without needing to buy more groceries which this API will assist with and solve. 

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express** (`express`) - web framework for buildling API
- **PostgreSQL** - relational database
- **pg** (`pg`) - Node.js client for connection to PostgreSQL
- **dotenv** (`dotenv`) - loads environment variables from '.env'
- **nodemon** (`nodemon`, dev dependency) - auto-restarts sever during development
- Deployed on **Render**

## Live API
https://recipe-app-469c.onrender.com/api/v1/recipes

## Prerequisites
- Node.js installed
- PostgreSQL installed (for local development)
- Git Bash or equivalent terminal

## Local Setup Instructions
1. Clone the repository
2. run `npm install` in Git Bash
3. create a `.env` file with:
    - DB_PASSWORD=your_local_postgres_password
    - (DATABASE_URL only needed if connecting to Render's DB directly)
4. Create the database and run SQL files in `recipe-appDB/`to setup tables
5. Run `npm run dev` to start the server locally (localhost:4000)

## API Endpoints:

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
    "suggested_sides": "string"
}
```
### PUT /api/v1/recipes/:id
Updates an existing recipe by ID.
//EXAMPLE: /api/v1/recipes/1  
```json
{
    "recipe_name": "string",
    "servings": number, 
    "total_calories": number, 
    "calories_per_serving": number, 
    "pairs_with": "string",
    "suggested_sides": "string"
}
```
## Data Source
Recipe data sourced from the [Food.com Recipes dataset](https://huggingface.co/datasets/AkashPS11/recipes_data_food.com) on Hugging Face (MIT License), accessed via their public Dataset Viewer API. Approximately 300+ recipes were imported using a custom script (`import.js`) that fetches, parses, and inserts the data into PostgreSQL.

## Author
Cam Mariotti
