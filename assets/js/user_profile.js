{
console.log("user profile script loaded");
var input = document.querySelector("#file-input");
console.log(input);

// document.querySelector("button").addEventListener("click", function () {
//   input.click();
// });
input.onchange = function preview() {
    console.log("Inside preview");
    var fileObject = this.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileObject);
    fileReader.onload = function () {
      var result = fileReader.result;
      var img = document.querySelector("#preview");
      img.setAttribute("src", result);
    };
  };  
input.addEventListener("change", preview);
}