const deleteProductButtonElements = document.querySelectorAll(
  ".product-item button"
); // selecting the button on the product items

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch( // deleting from database, using the grabbed productId and csrfToken from above to do so
    "/admin/products/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) { // if connection to server messes up
    alert("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); // removes the product
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct); // runs deleteProduct when the delete button is clciked
}
