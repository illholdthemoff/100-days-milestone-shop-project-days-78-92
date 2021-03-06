const mongodb = require("mongodb");

const db = require("../data/database");

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = "pending", date, orderId) {
    // the various things we will need in order to fulfil an order, all grabbed from whats on the right
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date); // this will transform whatever date is added in string form into an actual Date object.
    if (this.date) { // if there *is* a date added
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      }); // takes the Date object and again converts it to a more readable format.
    }
    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    // creates an array of the orderDocs
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    // returns every single order.
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders); // returns an array of all orderDocs
  }

  static async findAllForUser(userId) {
    // finds and returns all orders a given user made
    const uid = new mongodb.ObjectId(userId); // converts userId into a mongo acceptable format and assigns it to uid

    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "userData._id": uid })
      .sort({ _id: -1 }) // sorts in descending order
      .toArray();

    return this.transformOrderDocuments(orders); // returns an array of all orderDocs belonging to a given user
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order); // returns a specific order based on id
  }

  save() {
    // here we are taking the above data we get from an instance of the Order class and formatting it in a way such that we can throw it into the database.
    if (this.id) {
      // checking if ID exists ie if the order exists, and therefore updating
      const orderId = new mongodb.ObjectId(this.id); // converts the this.id into mongodb acceptable format
      return db
        .getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } }); // then updates the given order
    } else {
      const orderDocument = {
        // creating an order document to throw in the database
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
