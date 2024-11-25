class Drawer {
    constructor(id, name, weightperitem, weight, lastAddedDate, x = 0, y = 0, width = 100, height = 100, alertLimit = 0) {
        this.id = id; // הוספת שדה ID
        this.name = name;
        this.weightperitem = weightperitem;
        this.weight = weight;
        this.lastAddedDate = lastAddedDate;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alertLimit=alertLimit;
    }

    updateDetails(name, weightperitem, weight, lastAddedDate, x, y, width, height, alertLimit) {
        this.name = name;
        this.weightperitem = weightperitem;
        this.weight = weight;
        this.lastAddedDate = lastAddedDate;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alertLimit=alertLimit;
    }
    
    getQuantity(){
        const q = Math.floor(this.weight / this.weightperitem);
        if(q < 0){
            return 0;
        }
        else{
            return q;
        }
    }
    

    printDetails() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Weight Per Item: ${this.weightperitem}`);
        console.log(`Weight: ${this.weight}`);
        console.log(`Last Added Date: ${this.lastAddedDate}`);
        console.log(`x: ${this.x}`);
        console.log(`y: ${this.y}`);
        console.log(`width: ${this.width}`);
        console.log(`height: ${this.height}`);
        console.log(`quantity: ${this.getQuantity()}`);
    }

}

export default Drawer;
