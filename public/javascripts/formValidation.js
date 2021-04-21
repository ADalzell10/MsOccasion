// selectors
const form = document.getElementById("form");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");

// event listener for submit button to ensure each field has be
// filled correctly
form.addEventListener("submit", function (e) {
   const titleValue = title.value.trim();
   const descValue = description.value.trim();
   const priceValue = price.value.trim();

   if (titleValue === "" || titleValue == null) {
      e.preventDefault();
      setErrorFor(title, "Title cannot be blank");
   } else {
      setSuccessFor(title);
   }
   if (descValue === "" || descValue == null) {
      e.preventDefault();
      setErrorFor(description, "Description cannot be blank");
   } else {
      setSuccessFor(description);
   }

   if (priceValue === "" || priceValue == null) {
      e.preventDefault();
      setErrorFor(price, "Price cannot be blank");
   } else if (!isNumber(priceValue)) {
      e.preventDefault();
      setErrorFor(price, "Price must be a number");
   } else {
      setSuccessFor(price);
   }


});

function setErrorFor(input, message) {
      const formControl = input.parentElement; //form-control div
      const small = formControl.querySelector("small");

      //add error message inside small tag
      small.innerText = message;

      //add error class
      formControl.className = "form-inputs error"
}

function setSuccessFor(input) {
      const formControl = input.parentElement;
      formControl.className = "form-inputs success"
}

function isNumber(price) {
      return /^[0-9]*$/.test(price);
}