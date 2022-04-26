const mongodb = require ("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // gets name of image file
    this.imagePath = `product-data/image/${productData.image}`; // the actual path for the image. These are stored separately in case we need to access the name of the image file elsewhere
    this.imageUrl = `/products/assets/images/${productData.image}`;
    if (productData._id) {
      this.id = productData._id.toString(); // turning the id into a string from an object
    }
  }

  static async findById(productId) {
    let prodId;
    try {
prodId = new mongodb.ObjectId(productId); // converts the productId into the object that we can use as a parameter for the _id field, since in the database the _id field has more than just what our base productId is.
    } catch (error) {
      error.code = 404;
      throw error;
    }
    
    
    const product = await db.getDb().collection("products").findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id");
      error.code = 404;
      throw error;
    }

    return product;
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray(); // retrives everything from the product collection and then forces it to an array

    return products.map(function (productDocument) {
      return new Product(productDocument);
    }); // takes that array and then turns it into a Product like the one above via the map function.
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };
    await db.getDb().collection("products").insertOne(productData);
  }
}

module.exports = Product;
