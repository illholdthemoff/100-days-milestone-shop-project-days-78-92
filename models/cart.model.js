class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
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
      if (item.product.id === product.id) {
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
