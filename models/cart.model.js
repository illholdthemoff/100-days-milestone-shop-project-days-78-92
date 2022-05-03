class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    // initializes it as an empty array
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product === product.id) {
        cartItem.quantity = item.quantity + 1;
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
}

module.exports = Cart;
