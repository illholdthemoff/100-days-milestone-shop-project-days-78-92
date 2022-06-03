const updateOrderFormElements = document.querySelectorAll(
  ".order-actions form"
); // grabs the form.

async function updateOrder(event) {
  event.preventDefault(); // blocks default behavior IE browser sending http request
  const form = event.target; // defines the target of the updateOrder

  const formData = new FormData(form); // makes a new FormData object, constructing key/value pairs
  const newStatus = formData.get("status"); // grabbing status, orderid and the csrf tokens from the order form
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response; // setting as a let here so we can make changes to the response and also for scoping reasons

  try {
    response = await fetch(`/admin/orders/${orderId}`, { // grabbing the order id
      method: "PATCH", // making changes to server via patch
      body: JSON.stringify({  // converting the below into a json string
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json", // indicating original media type of resource prior to sending
      },
    });
  } catch (error) { // in case server connection fails
    alert("Something went wrong - could not update order status.");
    return;
  }

  if (!response.ok) { // in case something else on the browser side fails
    alert("Something went wrong - could not update order status.");
    return;
  }

  const responseData = await response.json(); // takes the json input from response and converts it into a js object, responseData

  form.parentElement.parentElement.querySelector(".badge").textContent =
    responseData.newStatus.toUpperCase(); // changing the badge text to uppercase
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder); // updating the order when the submit button is clicked
}
