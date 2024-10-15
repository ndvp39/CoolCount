// Drawer.js
class Drawer {
    constructor(name, weight, quantity, lastAddedDate) {
      this.name = name;
      this.weight = weight;
      this.quantity = quantity;
      this.lastAddedDate = lastAddedDate;
    }
  
    updateDetails(name, weight, quantity, lastAddedDate) {
      this.name = name;
      this.weight = weight;
      this.quantity = quantity;
      this.lastAddedDate = lastAddedDate;
    }
  
    // פונקציה להדפסת פרטי המגירה
    printDetails() {
      console.log(`Name: ${this.name}`);
      console.log(`Weight: ${this.weight}`);
      console.log(`Quantity: ${this.quantity}`);
      console.log(`Last Added Date: ${this.lastAddedDate}`);
    }
  }
  
  export default Drawer;
  