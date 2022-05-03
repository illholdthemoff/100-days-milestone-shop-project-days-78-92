const addToCartButtonElement = document.querySelector(
  "#product-details button"
);
const cartBadgeElement = document.querySelector(".nav-items .badge");

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid; // we added the dataset to the add to cart button in product-details.ejs
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      }, // we set this header because, while by default content type is automatically done by the browser, we have a custom type of request, so we have to do it manually to ensure it works.
    });
  } catch (error) {
    alert("Something went wrong!"); // in case connection to server fails
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!"); // in case it succeeds but doesnt work
    return;
  }

  const responseData = await response.json(); // this decodes the data FROM json to something more useable

  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElement.textContent = newTotalQuantity; // updates the badge thing to say whatver the newtotalquant of items is so IT SUPDATES
}

addToCartButtonElement.addEventListener("click", addToCart);
