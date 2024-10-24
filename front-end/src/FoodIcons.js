// FoodIcons.js
import { Apple, BananaIcon, Cake, Milk,Fish,Carrot,Egg} from 'lucide-react';

// אובייקט שמכיל את השמות בעברית (ולמעלה גם באנגלית)
const foodIcons = {
    "apple": <Apple style={{ color: 'red', width: '50px', height: '50px' }} />,
    "cake": <Cake style={{ color: 'pink', width: '50px', height: '50px' }} />,
    "milk": <Milk style={{ color: 'white', width: '50px', height: '50px' }} />,
    "banana": <BananaIcon style={{ color: 'yellow', width: '50px', height: '50px' }} />,
    "fish": <Fish style={{ color: 'blue', width: '50px', height: '50px' }} />,
    "carrot": <Carrot style={{ color: 'orange', width: '50px', height: '50px' }} />,
    "egg": <Egg style={{ color: 'white', width: '50px', height: '50px' }} />,

};

// אובייקט לתרגום לשמות באנגלית
const translations = {
    "תפוח": "apple",
    "עוגה": "cake",
    "חלב": "milk",
    "בננה": "banana",
    "דג": "fish",
    "גזר": "carrot",
    "ביצה": "egg"

};

// פונקציה לשליפת האייקון לפי שם המגירה
const getFoodIcon = (name) => {
    const lowercaseName = name.toLowerCase(); // המרת השם לאותיות קטנות
    return foodIcons[lowercaseName] || foodIcons[translations[lowercaseName]]; // שליפת האייקון
};

export { foodIcons, getFoodIcon };
