const imagePickerElement = document.querySelector(
  "#image-upload-control input"
); // searching the page for these elements, here to grab the thing that picks the image ie the upload
const imagePreviewElement = document.querySelector("#image-upload-control img"); // grabbing the image itself

function updateImagePreview() {
  const files = imagePickerElement.files; //this will be an array with one memeber

  if (!files || files.length === 0) {
    // in case the grabbing of the file fails in any way, or if the user didn't select one or something like that
    imagePreviewElement.style.display = "none"; // obviusly if no image, don't display
    return;
  }

  const pickedFile = files[0]; // since files is an array with one memebr we just get the one.

  imagePreviewElement.src = URL.createObjectURL(pickedFile); // creates string containing URL representing given object in parameter (pickedFile)
  imagePreviewElement.style.display = "block"; // set as block so it has its own space
}

imagePickerElement.addEventListener("change", updateImagePreview); //listening for anything changing in the imagepicker element, and then calling the update on it whenever that happens
