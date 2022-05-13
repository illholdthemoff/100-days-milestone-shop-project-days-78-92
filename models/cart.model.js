const Product = require("./product.model");
class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      // returns an array of product ids
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds); // returns a list of all products by grabbing them from the database and converting them into the class Product

    const deletableCartItemProductIds = []; // helper array, items to be deleted get sent into this

    for (const cartItem of this.items) {
      // checks to see if a given item within a list of items is actually still in the cart or not
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        //product was deleted from products list but in the cart, schedule for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id); // buhleets the item
        continue; // basically immediately starts the next iteration of our for loop without executing the below code.
      }

      //product not deleted
      //set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      // runs through the list of deletableCartItemProductIds and then filters/deletes them from the cart. this ONLY ACTIVATES if at least one product is scheduled for deletion.
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0; // if an item is found within that array, filter it from the total
      });
    }

    //re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        this.items[i] = cartItem; // updates the cart

        this.totalQuantity++; // adding an item to the cart when we add an item. The above if you remember refers to quantities of an individual item ie how many socks you have as opposed to this, the total quant of all items in cart.
        this.totalPrice += product.price;
        return; // returns because in many ways the bit below does that already so itd be redundant
      }
    }

    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1); // removes the item freom the cart if there is less than 1 of its kind in there.
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice; // subtracts the price of the current item from that of the entire cart.
        return { updatedItemPrice: 0 };
      }
    }
  }
}

module.exports = Cart;
