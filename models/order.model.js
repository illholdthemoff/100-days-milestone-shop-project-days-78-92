const db = require("../data/database");

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = "pending", date, orderId) {
    // the various things we will need in order to fulfil an order
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date); // this will transform whatever date is added in string form into an actual Date object.
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      }); // takes the Date object and again converts it to a more readable format.
    }
    this.id = orderId;
  }

  save() {
    // here we are taking the above data we get from an instance of the Order class and formatting it in a way such that we can throw it into the database.
    if (this.id) {
      // checking if ID exists ie if the order exists, and therefore updating
    } else {
      const orderDocument = {
        // creating a document to throw in the database
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status, // by default pending
      };

      return db.getDb().collection("orders").insertOne(orderDocument); // inserting the document to the database
    }
  }
}

module.exports = Order;
