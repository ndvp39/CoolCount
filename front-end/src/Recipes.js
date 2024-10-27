import React from 'react';
import './Recipes.css';

function RecipesList({ recipes }) {
    return (
        <div className="container mt-4">
            <div className="row">
                {recipes.map((recipe, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card recipe-card shadow-sm">
                            {recipe.image && (
                                <img src={recipe.image} alt={recipe.label} className="card-img-top recipe-img" />
                            )}
                            <div className="card-body">
                                <h5 className="card-title text-primary">{recipe.label}</h5>
                                <p className="card-text">
                                    <strong>מרכיבים:</strong> {recipe.ingredients.join(', ')}
                                </p>
                                <p className="card-text">
                                    <strong>קלוריות:</strong> {recipe.calories}
                                </p>
                                <p className="card-text">
                                    <strong>סוג מאכל:</strong> {recipe.dishType || 'לא צויין'}
                                </p>
                                <p className="card-text">
                                    <strong>זמן הכנה:</strong> {recipe.totalTime ? `${recipe.totalTime} דקות` : 'לא צויין'}
                                </p>
                                <button className="btn btn-outline-primary btn-block mt-2">
                                    צפייה במתכון
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
