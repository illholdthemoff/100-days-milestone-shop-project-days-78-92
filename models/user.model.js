const bcrypt = require("bcryptjs");

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

  getUserWithsameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email }); // searches the database for an email that maatches the one where this function is being used. We do not need to add 'async' here, since by defualt here we are retuning a promise (findOne results are a promise)
  }

  async existsAlready() {
    const existingUser = await this.getUserWithsameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  } // the objective of this is to take the properties of a User instance and put them into the database

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword); // comapres the unhashed password (as added by user) and compares it to the hashed password stored within the database. Returns a promise
  }
}

module.exports = User;
