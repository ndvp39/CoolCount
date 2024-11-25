// FoodIcons.js

// Importing food icons from the 'lucide-react' library
import { Apple, BananaIcon, Cake, Milk, Fish, Carrot, Egg } from 'lucide-react';

// Object containing food icons mapped by their English names
const foodIcons = {
    "apple": <Apple style={{ color: 'red', width: '50px', height: '50px' }} />, // Icon for an apple
    "cake": <Cake style={{ color: 'pink', width: '50px', height: '50px' }} />, // Icon for a cake
    "milk": <Milk style={{ color: 'white', width: '50px', height: '50px' }} />, // Icon for milk
    "banana": <BananaIcon style={{ color: 'yellow', width: '50px', height: '50px' }} />, // Icon for a banana
    "fish": <Fish style={{ color: 'blue', width: '50px', height: '50px' }} />, // Icon for a fish
    "carrot": <Carrot style={{ color: 'orange', width: '50px', height: '50px' }} />, // Icon for a carrot
    "egg": <Egg style={{ color: 'white', width: '50px', height: '50px' }} />, // Icon for an egg
};

// Object for translating Hebrew names into English names
const translations = {
    "תפוח": "apple", // Hebrew for apple
    "עוגה": "cake", // Hebrew for cake
    "חלב": "milk", // Hebrew for milk
    "בננה": "banana", // Hebrew for banana
    "דג": "fish", // Hebrew for fish
    "גזר": "carrot", // Hebrew for carrot
    "ביצה": "egg", // Hebrew for egg
};

// Function to retrieve the food icon by drawer name
const getFoodIcon = (name) => {
    const lowercaseName = name.toLowerCase(); // Converts the name to lowercase
    return foodIcons[lowercaseName] || foodIcons[translations[lowercaseName]]; // Retrieves the icon by English or translated name
};

// Exporting the food icons and the retrieval function for use in other components
export { foodIcons, getFoodIcon };
