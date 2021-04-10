const carouselImages = document.querySelector(".carousel-images");
const carouselButtons = document.querySelectorAll(".carousel-button");
const numberOfImages = document.querySelectorAll(".carousel-images img").length;

let imageIndex = 1;
let translateX = 0;

carouselButtons.forEach(function(button){
   button.addEventListener("click", function(event){
      if(event.target.id === "previous"){
         // checks if its at first image
         if(imageIndex != 1){
            // if not at first image, move index and image back 1
            imageIndex--;
            translateX+=300;
         }
      } else {
         if(imageIndex !== numberOfImages) {
            // if not at last image, go forward
            imageIndex++;
            translateX -= 300;
         }
      }

      // updates the translateX property in css for carousel
      // images class (starts at 0)
      carouselImages.style.transform = `translateX(${translateX}px)`;
   });
});