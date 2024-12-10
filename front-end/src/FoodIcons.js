// FoodIcons.js
//https://icons8.com/icons - taking all icons from here

// Object containing food icons mapped by their English names
const foodIcons = {
    "tomato": (
        <img
            src="https://img.icons8.com/emoji/48/tomato-emoji.png"
            alt="Tomato"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "cucumber": (
        <img
            src="https://img.icons8.com/emoji/48/cucumber.png"
            alt="Cucumber"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "milk": (
        <img
            src="https://img.icons8.com/?size=100&id=wwUGl1cL0faI&format=png&color=000000"
            alt="Milk"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "eggs": (
        <img
            src="https://img.icons8.com/?size=100&id=eTBp1xHFg5HU&format=png&color=000000"
            alt="Eggs"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "carrot": (
        <img
            src="https://img.icons8.com/?size=100&id=6f2WYNoYqbXP&format=png&color=000000"
            alt="Carrot"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "banana": (
        <img
            src="https://img.icons8.com/?size=100&id=p7YHa8almDEQ&format=png&color=000000"
            alt="Banana"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "cola": (
        <img
            src="https://img.icons8.com/?size=100&id=7xzdaY01UPxw&format=png&color=000000"
            alt="Cola"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "cheese": (
        <img
            src="https://img.icons8.com/?size=100&id=35111&format=png&color=000000"
            alt="Cheese"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "parsley": (
        <img
            src="https://img.icons8.com/?size=100&id=ocPNok5483IQ&format=png&color=000000"
            alt="Parsley"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "peper": (
        <img
            src="https://img.icons8.com/?size=100&id=70507&format=png&color=000000"
            alt="Peper"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "orange": (
        <img
            src="https://img.icons8.com/?size=100&id=57233&format=png&color=000000"
            alt="Orange"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "orange juice": (
        <img
            src="https://img.icons8.com/?size=100&id=AUF9Vyor9OEB&format=png&color=000000"
            alt="Orange Juice"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "cabbage": (
        <img
            src="https://img.icons8.com/?size=100&id=nsOarjBzII4l&format=png&color=000000"
            alt="Cabbage"
            style={{ width: '50px', height: '50px' }}
        />
    ), 
    "sauces": (
        <img
            src="https://img.icons8.com/?size=100&id=apbVbovMfNRT&format=png&color=000000"
            alt="Sauces"
            style={{ width: '50px', height: '50px' }}
        />
    ),  
    "pizza": (
        <img
            src="https://img.icons8.com/?size=100&id=80764&format=png&color=000000"
            alt="Pizza"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "cake": (
        <img
            src="https://img.icons8.com/?size=100&id=97331&format=png&color=000000"
            alt="Cake"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "apple": (
        <img
            src="https://img.icons8.com/?size=100&id=5J0YM2MKuxZO&format=png&color=000000"
            alt="Apple"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "fruits": (
        <img
            src="https://img.icons8.com/?size=100&id=AIuc7Bz9E3LA&format=png&color=000000"
            alt="Fruits"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "pot": (
        <img
            src="https://img.icons8.com/?size=100&id=IaGn4iiEYZTd&format=png&color=000000"
            alt="Pot"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "yogurt": (
        <img
            src="https://img.icons8.com/?size=100&id=WYvhyw866rMy&format=png&color=000000"
            alt="Yogurt"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    "leaves": (
        <img
            src="https://img.icons8.com/?size=100&id=w3aK4LClgYL1&format=png&color=000000"
            alt="Leaves"
            style={{ width: '50px', height: '50px' }}
        />
    ),     
    
    
    
};

// Object for translating Hebrew names into English names
const translations = {
    "תפוח": "apple", // Hebrew for apple
    "עוגה": "cake", // Hebrew for cake
    "חלב": "milk", // Hebrew for milk
    "בננה": "banana", // Hebrew for banana
    "דג": "fish", // Hebrew for fish
    "גזר": "carrot", // Hebrew for carrot
    "ביצה": "eggs", // Hebrew for egg
    "עגבניה": "tomato", // Hebrew for tomato
    "מלפפון": "cucumber", // Hebrew for cucumber
};

// Function to retrieve the food icon by drawer name
const getFoodIcon = (name) => {
    const lowercaseName = name.toLowerCase(); // Converts the name to lowercase
    return foodIcons[lowercaseName] || foodIcons[translations[lowercaseName]]; // Retrieves the icon by English or translated name
};

// Exporting the food icons and the retrieval function for use in other components
export { foodIcons, getFoodIcon };
