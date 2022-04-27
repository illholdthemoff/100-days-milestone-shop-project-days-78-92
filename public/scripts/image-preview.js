const imagePickerElement = document.querySelector(
  "#image-upload-control input"
);
const imagePreviewElement = document.querySelector("#image-upload-control img");

function updateImagePreview() {
  const files = imagePickerElement.files; //this will be an array with one memeber

  if (!files || files.length === 0) {
    // in case the grabbing of the file fails in any way, or if the user didn't select one or something like that
    imagePreviewElement.style.display = "none";
    return;
  }

  const pickedFile = files[0]; // since files is an array with one memebr we just get the one.

  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = "block";
}

imagePickerElement.addEventListener("change", updateImagePreview);
