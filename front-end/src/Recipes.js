// RecipesList Component
// Displays a list of recipes with details and options to show ingredients or view the full recipe.

import React, { useState } from 'react';
import './Recipes.css';

function RecipesList({ recipes }) { // Receives the recipes as props
    const [showIngredients, setShowIngredients] = useState(Array(recipes.length).fill(false)); // Tracks visibility of ingredients for each recipe

    // Toggles the visibility of ingredients for a specific recipe
    const toggleIngredients = (index) => {
        const updatedShowIngredients = [...showIngredients]; // Creates a copy of the visibility array
        updatedShowIngredients[index] = !updatedShowIngredients[index]; // Toggles the value for the specific index
        setShowIngredients(updatedShowIngredients); // Updates the state
    };

    return (
        <div className="recipes-list container mt-4">
              {recipes.length === 0 ? ( // if no recipes
                <div className="text-center">
                    <h5>No Recipes Found</h5>
                </div>
            ) : (
            <div className="row">
                {recipes.map((item, index) => (
                    <div className="mb-4" key={index}>
                        <div className="recipe-card shadow-sm">
                            {item.recipe.image && ( // Displays the recipe image if available
                                <img
                                    src={item.recipe.image}
                                    alt={item.recipe.label}
                                    className="recipe-img"
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">
                                    {item.recipe.label || 'Recipe Without Name'} {/* Displays the recipe name or a default */}
                                </h5>
                                {/* Button to toggle ingredients visibility */}
                                <button
                                    className="btn mb-2"
                                    onClick={() => toggleIngredients(index)}
                                >
                                    {showIngredients[index] ? 'Hide Ingredients' : 'Show Ingredients'}
                                </button>
                                {showIngredients[index] && ( // Displays ingredients if toggled
                                    <div className="ingredients-list">
                                        <strong>Ingredients:</strong>
                                        <ul>
                                            {item.recipe.ingredientLines.map((ingredient, ingIndex) => (
                                                <li key={ingIndex}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className="card-text">
                                    <strong>Calories:</strong>{' '}
                                    {Math.round(item.recipe.calories) || 'Not Specified'}
                                </p>
                                <p className="card-text">
                                    <strong>Dish Type:</strong>{' '}
                                    {item.recipe.dishType || 'Not Specified'}
                                </p>
                                <p className="card-text">
                                    <strong>Preparation Time:</strong>{' '}
                                    {item.recipe.totalTime
                                        ? `${item.recipe.totalTime} minutes`
                                        : 'Not Specified'}
                                </p>
                                {/* Button to view the full recipe */}
                                <button
                                    className="btn"
                                    onClick={() => window.open(item.recipe.shareAs, '_blank')}
                                >
                                    View Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             )}
        </div>
    );
}

export default RecipesList;