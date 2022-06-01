const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email; // 'this' here refers to the 'to be created' object, ie when we instnatiate the thign
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  } // nested object

  static findById(userId) {
    // finds a user by ID then returns some of that data in the form of a document.
    //also not async because we are returning the promise below already.
    const uid = new mongodb.ObjectId(userId); // taking the userId entered and converting it into a mongodb format

    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } }); // checking in the database if any id matches the given. The 0 with password means specifically that we do NOT want that returned.
  }

  getUserWithsameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email }); // searches the database for an email that maatches the one where this function is being used. We do not need to add 'async' here, since by defualt here we are retuning a promise (findOne results are a promise)
  }

  async existsAlready() {
    const existingUser = await this.getUserWithsameEmail(); // checking if the emails match up
    if (existingUser) {
      return true; // the user exists already
    }
    return false; // user does not exist already
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12); // taking the password and hashing it via an algorithm with a strength of 12

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  } // the objective of this is to take the properties of a User instance and put them into the database. Storing the hashed password of course so if the db is breached/leaked all user info isn't released

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword); // comapres the unhashed password (as added by user) and compares it to the hashed password stored within the database. Returns a promise
  }
}

module.exports = User;
