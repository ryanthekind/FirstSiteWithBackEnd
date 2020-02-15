function newPicture() {
    
    document.getElementById("image").src="./images/jhlogo.jpg"; 
    }
    
    function oldPicture() {
    
    document.getElementById("image").src="./images/corporatepride.jpg" ;
    }

    $("#image").click(function(){
         window.open("https://www.johnhancock.com/");
    });

    $(document).ready(function(){
     $('[data-toggle="tooltip"]').tooltip();   
    });


// Fade button out after submit ---Ugh it failed :-(
const btn = document.getElementById("btn");

btn.addEventListener("click", () =>{
     btn.classList("hide-me");
});

// Second attempt
  function checkForm(form)
  {
    // validate form fields
    form.myButton.disabled = true;
    return true;
  }

//refresh after modal click
function refreshPage(){
    window.location.reload();
} 

