import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function RecipesList() {
    const location = useLocation();
    const recipes = location.state?.recipes || []; // קבלת recipes או רשימה ריקה כברירת מחדל

    // מצב להחזקת המידע על האם להציג את המרכיבים עבור כל מתכון
    const [showIngredients, setShowIngredients] = useState(Array(recipes.length).fill(false));

    const toggleIngredients = (index) => {
        const updatedShowIngredients = [...showIngredients];
        updatedShowIngredients[index] = !updatedShowIngredients[index];
        setShowIngredients(updatedShowIngredients);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {recipes.map((item, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card recipe-card shadow-sm">
                            {item.recipe.image && (
                                <img src={item.recipe.image} alt={item.recipe.label} className="card-img-top recipe-img" />
                            )}
                            <div className="card-body">
                                <h5 className="card-title text-primary">{item.recipe.label || 'Recipe Without Name'}</h5>
                                {/* כפתור להציג/להסתיר את המרכיבים */}
                                <button 
                                    className="btn btn-outline-secondary mb-2" 
                                    onClick={() => toggleIngredients(index)}
                                >
                                    {showIngredients[index] ? 'Hide Ingredients' : 'Show Ingredients'}
                                </button>
                                {showIngredients[index] && (
                                    <p>
                                        <strong>Ingredients:</strong>
                                        <ul>
                                            {item.recipe.ingredientLines.map((ingredient, ingIndex) => (
                                                <li key={ingIndex}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </p>
                                )}
                                <p className="card-text">
                                    <strong>Calories:</strong> {item.recipe.calories || 'Not Specified'}
                                </p>
                                <p className="card-text">
                                    <strong>Dish Type:</strong> {item.recipe.dishType || 'Not Specified'}
                                </p>
                                <p className="card-text">
                                    <strong>Preparation Time:</strong> {item.recipe.totalTime ? `${item.recipe.totalTime} minutes` : 'Not Specified'}
                                </p>
                                <button
                                    className="btn btn-outline-primary btn-block mt-2"
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
