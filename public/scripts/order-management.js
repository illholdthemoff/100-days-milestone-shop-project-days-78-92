const updateOrderFormElements = document.querySelectorAll(
  ".order-actions form"
); // grabs the form.

async function updateOrder(event) {
  event.preventDefault(); // blocks default behavior IE browser sending http request
  const form = event.target; // defines the target of the updateOrder

  const formData = new FormData(form);
  const newStatus = formData.get("status");
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  const responseData = await response.json();

  form.parentElement.parentElement.querySelector(".badge").textContent =
    responseData.newStatus.toUpperCase();
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder);
}
