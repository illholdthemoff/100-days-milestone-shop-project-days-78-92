const mobileMenuBtnElement = document.getElementById("mobile-menu-btn"); // grabbing the button for the mobile menu (that hides and shows it)
const mobileMenuElement = document.getElementById("mobile-menu"); // grabbing the menu itself

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle("open"); // toggling the 'open' class on and off of the menu, which in the CSS file contains a display:none or something like that
}

mobileMenuBtnElement.addEventListener("click", toggleMobileMenu); // event listener for clicks
