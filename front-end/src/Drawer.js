// Drawer.js
class Drawer {
  constructor(name, weightperitem, weight, quantity, lastAddedDate) {
      this.name = name;
      this.weightperitem = weightperitem;
      this.weight = weight;
      this.quantity = quantity;
      this.lastAddedDate = lastAddedDate;
  }

  updateDetails(name, weightperitem, weight, quantity, lastAddedDate) {
      this.name = name;
      this.weightperitem = weightperitem;
      this.weight = weight;
      this.quantity = quantity;
      this.lastAddedDate = lastAddedDate;
  }

  // Function to print drawer details
  printDetails() {
      console.log(`Name: ${this.name}`);
      console.log(`Weight Per Item: ${this.weightperitem}`);
      console.log(`Weight: ${this.weight}`);
      console.log(`Quantity: ${this.quantity}`);
      console.log(`Last Added Date: ${this.lastAddedDate}`);
  }
}

export default Drawer;

