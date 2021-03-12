console.log("Forgot password script loaded successfully!");

var email = $("#inp_uname");
var pass1 = $("#inp_pw");
var pass2 = $("#inp_cnf_pw");
var btn_submit = $("#btn_submit");

function displayAlert(){
    if(email.val()!="" && pass1.val()!= "" && pass2.val()!= ""){
        alert("Congratulations!! Your password has been sucessfully changed now! Login with your new credentials to get started!");
    }
}
