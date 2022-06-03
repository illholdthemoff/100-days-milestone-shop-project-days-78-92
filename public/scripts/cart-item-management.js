const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-management"
);
const cartTotalPriceElement = document.getElementById("cart-total-price"); // grabbing the cart-total-price id 
const cartBadgeElements = document.querySelectorAll(".nav-items .badge"); // grabbing whatever has the .nav-items and .badge classes

async function updateCartItem(event) {
  event.preventDefault(); // prevents default behavior IE page refreshing

  const form = event.target; //the event target ie the page

  const productId = form.dataset.productid; // grabbing the id, csrf and quantities from the page
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch("/cart/items", { // fetching and patching 
      method: "PATCH",
      body: JSON.stringify({ // converting the body js object into a json object
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json", // setting the headers so that the JSON knows what to look for iirc
      },
    });
  } catch (error) { // if something like the connection to the server fials
    alert("Something went wrong!"); 
    return;
  }

  if (!response.ok) { // if something goes wrong with the page itself
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json(); // returns a promise resolved when parsing the text as json

  if (responseData.updatedCartData.updatedItemPrice === 0) { // roundabout way of saying if the item price is 0 ie removed from cart
    form.parentElement.parentElement.remove(); // remove item from the card
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(".cart-item-price"); // searches the document for the .cart-item-price class
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2); // then throws in its contents(the price) while formatting it to 2 decimal places through the toFixed
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2); // adds together all the prices of everything in the cart

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent =
      responseData.updatedCartData.newTotalQuantity; // updates the little counter badge with whatever the new quantity is
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem); // go to update cart item when the submit button is clicked.
}
