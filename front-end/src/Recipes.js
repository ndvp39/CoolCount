import React, { useState } from 'react';
import './Recipes.css'; 

function RecipesList({ recipes }) { // קבלת recipes כ-props
    const [showIngredients, setShowIngredients] = useState(Array(recipes.length).fill(false));

    const toggleIngredients = (index) => {
        const updatedShowIngredients = [...showIngredients];
        updatedShowIngredients[index] = !updatedShowIngredients[index];
        setShowIngredients(updatedShowIngredients);
    };

    return (
        <div className="recipes-list container mt-4">
            <div className="row">
                {recipes.map((item, index) => (
                    <div className="mb-4" key={index}>
                        <div className="recipe-card shadow-sm">
                            {item.recipe.image && (
                                <img
                                    src={item.recipe.image}
                                    alt={item.recipe.label}
                                    className="recipe-img"
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{item.recipe.label || 'Recipe Without Name'}</h5>
                                {/* כפתור להציג/להסתיר את המרכיבים */}
                                <button
                                    className="btn mb-2"
                                    onClick={() => toggleIngredients(index)}
                                >
                                    {showIngredients[index] ? 'Hide Ingredients' : 'Show Ingredients'}
                                </button>
                                {showIngredients[index] && (
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
        </div>
    );
    
}

export default RecipesList;
