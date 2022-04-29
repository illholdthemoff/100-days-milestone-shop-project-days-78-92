class Cart {
  constructor(items = []) {
    // initializes it as an empty array
    this.items = items;
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
        cartItem.quantity = cartItem.quantity + 1;
        cartItem.totalPrice = cartItem.totalPrice + product.price;
        this.items[i] = cartItem; // updates the cart
        return; // returns because in many ways the bit below does that already so itd be redundant
      }
    }
    this.items.push(product);
  }
}
