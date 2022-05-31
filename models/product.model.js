const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) { // attempting to find a product by its id
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId); // converts the productId into a mongo readable form in prodId
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId }); // then searches the database in the products collection for an id thtat matches.

    if (!product) { // if the id is not found
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(product); // returns the product if the id matches
  }

  static async findAll() { // attempts to find all products in the database collection
    const products = await db.getDb().collection("products").find().toArray();

    return products.map(function (productDocument) { // then returns a map (new array) of said products
      return new Product(productDocument); // returns the array
    });
  }

  static async findMultiple(ids) { // attempts to find a group of products based on their id
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id); // turns them into mongodb id objects
    });

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } }) // returns all product ids within the productIds document within mongo
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument); // turns it into an array of Products, as in the class.
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) { // if it has an id ie IF THE ITEM EXISTS
      const productId = new mongodb.ObjectId(this.id); // convert the id into mongo format

      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      ); // if the item exists update it
    } else {
      await db.getDb().collection("products").insertOne(productData);
    } // if the item does not exist, create it and insert it into the database collection
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId }); // delete from db
  }
}

module.exports = Product;
